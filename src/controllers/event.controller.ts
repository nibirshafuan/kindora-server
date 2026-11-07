import type { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

interface EventDocument {
  title: string;
  description: string;
  eventType: string;
  imageUrl: string;
  location: string;
  eventDate: Date;
  creatorEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const getUserEmail = (res: Parameters<RequestHandler>[1]): string | null => {
  const user = res.locals.auth as { email?: string } | undefined;
  return user?.email || null;
};

const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

// Create Event
export const createEvent: RequestHandler = async (req, res) => {
  try {
    const creatorEmail = getUserEmail(res);

    if (!creatorEmail) {
      res.status(401).json({
        success: false,
        message: "Authenticated user email not found.",
      });
      return;
    }

    const {
      title,
      description,
      eventType,
      imageUrl,
      location,
      eventDate,
    } = req.body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !eventType?.trim() ||
      !imageUrl?.trim() ||
      !location?.trim() ||
      !eventDate
    ) {
      res.status(400).json({
        success: false,
        message: "All event fields are required.",
      });
      return;
    }

    if (!isValidUrl(imageUrl)) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid image URL.",
      });
      return;
    }

    const parsedDate = new Date(eventDate);

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate <= new Date()
    ) {
      res.status(400).json({
        success: false,
        message: "Event date must be in the future.",
      });
      return;
    }

    const now = new Date();

    const event: EventDocument = {
      title: title.trim(),
      description: description.trim(),
      eventType: eventType.trim(),
      imageUrl: imageUrl.trim(),
      location: location.trim(),
      eventDate: parsedDate,
      creatorEmail,
      createdAt: now,
      updatedAt: now,
    };

    const result = await getDB()
      .collection<EventDocument>("events")
      .insertOne(event);

    res.status(201).json({
      success: true,
      message: "Event created successfully!",
      event: {
        _id: result.insertedId,
        ...event,
      },
    });
  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create event.",
    });
  }
};

// Get Upcoming Events
export const getUpcomingEvents: RequestHandler = async (_req, res) => {
  try {
    const rawLimit = Number(_req.query.limit ?? 20);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(Math.floor(rawLimit), 1), 100)
      : 20;

    const events = await getDB()
      .collection<EventDocument>("events")
      .find({
        eventDate: { $gt: new Date() },
      })
      .sort({ eventDate: 1 })
      .limit(limit)
      .toArray();

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get upcoming events error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming events.",
    });
  }
};

// Get Event Details
export const getEventById: RequestHandler = async (req, res) => {
  try {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
      return;
    }

    const event = await getDB()
      .collection<EventDocument>("events")
      .findOne({ _id: new ObjectId(id) });

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get event details error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch event details.",
    });
  }
};

// Update Own Event
export const updateEvent: RequestHandler = async (req, res) => {
  try {
    const creatorEmail = getUserEmail(res);
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    if (!creatorEmail) {
      res.status(401).json({
        success: false,
        message: "Authenticated user email not found.",
      });
      return;
    }

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
      return;
    }

    const allowedFields = [
      "title",
      "description",
      "eventType",
      "imageUrl",
      "location",
      "eventDate",
    ];

    const updates: Record<string, string | Date> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (
          typeof req.body[field] !== "string" ||
          !req.body[field].trim()
        ) {
          res.status(400).json({
            success: false,
            message: `${field} must be a non-empty string.`,
          });
          return;
        }

        updates[field] = req.body[field].trim();
      }
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({
        success: false,
        message: "Provide at least one field to update.",
      });
      return;
    }

    if (updates.imageUrl && !isValidUrl(updates.imageUrl as string)) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid image URL.",
      });
      return;
    }

    if (updates.eventDate) {
      const parsedDate = new Date(updates.eventDate);

      if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate <= new Date()
      ) {
        res.status(400).json({
          success: false,
          message: "Event date must be in the future.",
        });
        return;
      }

      updates.eventDate = parsedDate;
    }

    updates.updatedAt = new Date();

    const collection = getDB().collection<EventDocument>("events");

    const result = await collection.updateOne(
      {
        _id: new ObjectId(id),
        creatorEmail,
      },
      {
        $set: updates,
      }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Event not found or you are not the creator.",
      });
      return;
    }

    const updatedEvent = await collection.findOne({
      _id: new ObjectId(id),
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully!",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update event.",
    });
  }
};

// Delete Own Event
export const deleteEvent: RequestHandler = async (req, res) => {
  try {
    const creatorEmail = getUserEmail(res);
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    if (!creatorEmail) {
      res.status(401).json({
        success: false,
        message: "Authenticated user email not found.",
      });
      return;
    }

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
      return;
    }

    const result = await getDB()
      .collection<EventDocument>("events")
      .deleteOne({
        _id: new ObjectId(id),
        creatorEmail,
      });

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Event not found or you are not the creator.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete event.",
    });
  }
};

