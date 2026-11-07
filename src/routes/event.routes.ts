import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createEvent,
  getUpcomingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

const router = Router();

router.get("/", getUpcomingEvents);
router.get("/:id", getEventById);

router.post("/", authMiddleware, createEvent);
router.patch("/:id", authMiddleware, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

export default router;
