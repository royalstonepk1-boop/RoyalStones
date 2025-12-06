const express = require('express');
const router = express.Router();
const { createConversation, listConversations } = require('../controller/conversationController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, createConversation);
router.get('/', authMiddleware, listConversations);

module.exports = router;
