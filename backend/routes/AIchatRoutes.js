// For DeepSeek based AI Chatbot
const express = require('express');
const { chatController } = require('../controllers/ai_chatbox.controller'); 

const router = express.Router(); 

router.post('/chat', chatController);

module.exports = router; 