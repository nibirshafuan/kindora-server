import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { connectDB } from "./config/db.js";
import { createAuth } from "./config/auth.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import eventRoutes from "./routes/event.routes.js";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Kindora API",
    version: "1.0.0",
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Kindora server is running!",
    timestamp: new Date().toISOString(),
  });
});

const startServer = async () => {
  try {
    await connectDB();

    const auth = createAuth();

    app.all("/api/auth/*splat", toNodeHandler(auth));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/api/events", eventRoutes);

    app.get("/api/protected/profile", authMiddleware, (_req, res) => {
      const user = res.locals.auth;

      res.status(200).json({
        success: true,
        message: "Protected API accessed successfully!",
        user: {
          id: user.sub,
          email: user.email,
        },
      });
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Kindora server running on port ${PORT}`);
      console.log("Server listening on 0.0.0.0");
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
