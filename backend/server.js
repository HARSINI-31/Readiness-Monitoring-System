const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const seedAdmin = require("./utils/seedAdmin");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const readinessRoutes = require("./routes/readinessRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect Database
connectDB().then(() => {
  // Seed Default Admin
  seedAdmin();
  
  // Routes
  app.use("/", authRoutes);
  app.use("/", profileRoutes);
  app.use("/", readinessRoutes);
  app.use("/", adminRoutes);
  app.use("/api/contact", contactRoutes);

  // Health Check
  app.get("/health", (req, res) => {
    res.json({ status: "Server is running", db: "Connected" });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
