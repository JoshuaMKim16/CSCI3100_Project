const Message = require('../models/message.model');

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { sender, text } = req.body;
    const newMessage = new Message({ sender, text });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post message.' });
  }
};