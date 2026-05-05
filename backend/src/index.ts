import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Better Auth handler - MUST be before express.json()
app.all("/api/auth/*", toNodeHandler(auth));

// Express JSON middleware - only apply to non-auth routes
app.use("/api/*", (req, res, next) => {
  if (!req.path.startsWith("/api/auth")) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CRM API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Auth endpoint: http://localhost:${PORT}/api/auth`);
});
