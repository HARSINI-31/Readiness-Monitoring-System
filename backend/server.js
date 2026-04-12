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

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://readiness-monitoring-system.onrender.com"
];

if (process.env.CORS_ORIGINS) {
  allowedOrigins.push(...process.env.CORS_ORIGINS.split(","));
}

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith(".vercel.app") || 
                      process.env.NODE_ENV === 'development';
                      
    if (isAllowed) {
      return callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
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
