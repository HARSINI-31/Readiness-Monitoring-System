const ContactMessage = require("../models/ContactMessage");

// Save contact message
exports.saveContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const contactMessage = new ContactMessage({ name, email, subject, message });
    await contactMessage.save();
    res.status(201).json({ message: "Message stored successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all contact messages
exports.getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
