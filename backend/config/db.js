const mongoose = require("mongoose");

const connectDB = async () => {
  const atlasURI = process.env.MONGODB_URI;
  const localURI = "mongodb://127.0.0.1:27017/ready-monitor";

  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(atlasURI || localURI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Atlas Connection Failed, trying local...");
    try {
      await mongoose.connect(localURI);
      console.log("✅ Connected to Local MongoDB");
    } catch (localError) {
      console.error("❌ Local connection also failed:", localError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
