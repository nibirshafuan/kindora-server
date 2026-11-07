import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { connectDB } from "./config/db.js";
import { createAuth } from "./config/auth.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
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

    app.listen(PORT, () => {
      console.log("MongoDB connected successfully!");
      console.log(`Kindora server running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}`);
      console.log(`Auth: http://localhost:${PORT}/api/auth`);
      console.log(`Protected API: http://localhost:${PORT}/api/protected/profile`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
