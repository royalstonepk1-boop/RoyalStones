const express = require('express');
const router = express.Router();
const { createConversation, listConversations, getConversationById } = require('../controller/conversationController');
const { authMiddleware } = require('../middleware/auth');

// Create or get existing conversation
router.post('/', authMiddleware, createConversation);

// Get all conversations for logged-in user
router.get('/', authMiddleware, listConversations);

// Get specific conversation by ID


module.exports = router;