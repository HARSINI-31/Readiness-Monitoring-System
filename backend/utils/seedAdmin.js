const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
      const adminPass = process.env.ADMIN_PASSWORD || "admin123";
      
      const hashedPassword = await bcrypt.hash(adminPass, 10);

      const admin = new User({
        name: "Main Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin"
      });

      await admin.save();
      console.log(`✅ Default Admin Created: ${adminEmail}`);
    } else {
      console.log("ℹ Admin Already Exists");
    }
  } catch (error) {
    console.log("❌ Admin creation error:", error);
  }
};

module.exports = createAdmin;
