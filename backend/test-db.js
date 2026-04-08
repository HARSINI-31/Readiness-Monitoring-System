const mongoose = require("mongoose");
require("dotenv").config();

console.log("Testing with URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connection Successful!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Connection Failed:");
    console.error(err);
    process.exit(1);
  });
