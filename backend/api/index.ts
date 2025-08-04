// API entry point for Vercel deployment
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../src/config/database";
import authRoutes from "../src/routes/auth";
import notesRoutes from "../src/routes/notes";

// Load environment variables
dotenv.config();

// Connect to MongoDB (non-blocking)
connectDB().catch(console.error);

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://note-taking-8lwgc7i61-ayushkumars-projects.vercel.app",
      "https://note-taking-app-git-main-ayushkumars-projects.vercel.app",
      "https://note-taking-g9oralx2r-ayushkumars-projects.vercel.app",
      "https://note-taking-app-rho-five.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })


app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "SUCCESS",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Handle root route
app.get("/", (req, res) => {
  res.json({
    status: "SUCCESS",
    message: "Note-taking app API is running!",
    endpoints: {
      health: "GET /health",
      auth: "POST /auth/*",
      notes: "GET|POST|PUT|DELETE /notes/*",
    },
  });
});

// Export for Vercel
export default app;
