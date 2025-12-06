const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controller/messageController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, sendMessage);
router.get('/:conversationId', authMiddleware, getMessages);

module.exports = router;
