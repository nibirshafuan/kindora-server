import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  createEvent,
  getUpcomingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  getJoinedEvents,
  getMyEvents,
} from "../controllers/event.controller.js";

const router = Router();

// Public routes
router.get("/", getUpcomingEvents);

// Protected routes
router.get("/joined", authMiddleware, getJoinedEvents);
router.get("/mine", authMiddleware, getMyEvents);

// Event details
router.get("/:id", getEventById);

// Event management
router.post("/", authMiddleware, createEvent);
router.post("/:id/join", authMiddleware, joinEvent);
router.patch("/:id", authMiddleware, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

export default router;
