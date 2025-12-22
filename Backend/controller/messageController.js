const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// Send a message
async function sendMessage(req, res) {
  try {
    const { conversationId, message } = req.body;

    // Validate input
    if (!conversationId || !message) {
      return res.status(400).json({ message: 'Conversation ID and message are required' });
    }

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is part of the conversation
    if (!conversation.users.includes(req.user._id)) {
      return res.status(403).json({ message: 'You are not part of this conversation' });
    }

    // Create message
    const msg = await Message.create({
      conversationId,
      senderId: req.user._id,
      message
    });

    // Populate sender details before sending response
    await msg.populate('senderId', 'name email role');

    res.status(201).json(msg);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: err.message });
  }
}

// Get messages for a conversation
async function getMessages(req, res) {
  try {
    const { conversationId } = req.params;

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is part of the conversation
    if (!conversation.users.includes(req.user._id)) {
      return res.status(403).json({ message: 'You are not part of this conversation' });
    }

    // Get messages sorted by creation time
    const msgs = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name email role');

    res.json(msgs);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: err.message });
  }
}

// Mark messages as read (optional feature)
async function markMessagesAsRead(req, res) {
  try {
    const { conversationId } = req.params;

    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: req.user._id },
        isRead: false
      },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { sendMessage, getMessages, markMessagesAsRead };