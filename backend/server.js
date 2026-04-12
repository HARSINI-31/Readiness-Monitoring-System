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

const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(",") 
  : ['http://https://readiness-monitoring-system.onrender.com:3000', 'http://https://readiness-monitoring-system.onrender.com:3001', 'http://https://readiness-monitoring-system.onrender.com:3002'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
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

  // Root redirect to health
  app.get("/", (req, res) => {
    res.redirect("/health");
  });

  // Health Check
  app.get("/health", (req, res) => {
    res.json({ 
      status: "Server is running", 
      db: "Connected",
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development'
    });
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
