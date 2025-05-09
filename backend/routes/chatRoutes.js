const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// For Socket.io chatting routes
router.get('/', chatController.getMessages);
router.post('/', chatController.postMessage);

module.exports = router;