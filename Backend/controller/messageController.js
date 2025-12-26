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


async function markMessagesAsRead(req, res) {
  try {
    const { id } = req.params; // Get from URL params, not body
    //console.log('Marking messages as read for conversation:', id);
    const userId = req.user._id;

    // Update all messages in this conversation that:
    // 1. Were NOT sent by the current user
    // 2. Are currently unread (isRead: false)
    const result = await Message.updateMany(
      {
        conversationId: id,
        senderId: { $ne: userId }, // Messages not sent by current user
        isRead: false // Currently unread
      },
      {
        $set: { isRead: true } // Mark as read
      }
    );

    res.json({ 
      success: true, 
      message: 'Messages marked as read',
      modifiedCount: result.modifiedCount 
    });
  } catch (err) {
    console.error('Mark messages as read error:', err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { sendMessage, getMessages, markMessagesAsRead };