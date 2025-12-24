const express = require('express');
const router = express.Router();
const { sendMessage, getMessages,markMessagesAsRead } = require('../controller/messageController');
const { authMiddleware } = require('../middleware/auth');

// Send a message
router.post('/', authMiddleware, sendMessage);

// Get messages for a conversation
router.get('/:conversationId', authMiddleware, getMessages);
router.put('/markRead/:id', authMiddleware, markMessagesAsRead);

module.exports = router;