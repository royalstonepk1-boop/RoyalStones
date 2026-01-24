const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Create or get existing conversation
async function createConversation(req, res) {
  try {
    const { userId, adminId } = req.body;

    // Validate input
    if (!userId || !adminId) {
      return res.status(400).json({ message: "userId and adminId are required" });
    }

    // Find users
    const user = await User.findById(userId);
    const admin = await User.findById(adminId);

    if (!user || !admin) {
      return res.status(404).json({ message: "User or Admin not found" });
    }

    // Verify roles
    if (user.role !== 'user') {
      return res.status(400).json({ message: "First person must be a user" });
    }

    if (admin.role !== 'admin') {
      return res.status(400).json({ message: "Second person must be an admin" });
    }

    // Check if user is authorized (can only create conversation for themselves)
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to create this conversation" });
    }

    // Check if conversation already exists
    const existing = await Conversation.findOne({
      users: { $all: [userId, adminId] }
    }).populate('users');

    if (existing) {
      return res.json(existing);
    }

    // Create new conversation
    const conversation = await Conversation.create({
      users: [userId, adminId]
    });

    // Populate users before sending response
    await conversation.populate('users');

    res.status(201).json(conversation);

  } catch (err) {
    console.error('Create conversation error:', err);
    res.status(500).json({ message: err.message });
  }
}

// Get all conversations for logged-in user
async function listConversations(req, res) {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({ 
      users: userId 
    })
    .populate('users')
    .sort({ createdAt: -1 });

    // Add last message and unread messages info to each conversation
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({ 
          conversationId: conv._id 
        })
        .sort({ createdAt: -1 })
        .populate('senderId', 'name');

        // Get all unread messages (messages NOT sent by current user AND not read)
        const unreadMessages = await Message.find({
          conversationId: conv._id,
          senderId: { $ne: userId }, // Not sent by the current user
          isRead: false // Not read yet
        }).select('_id message createdAt');

        return {
          ...conv.toObject(),
          lastMessage: lastMessage || null,
          unreadMessages: unreadMessages // Array of unread message objects
        };
      })
    );

    res.json(conversationsWithLastMessage);
  } catch (err) {
    console.error('List conversations error:', err);
    res.status(500).json({ message: err.message });
  }
}



// Get specific conversation by ID
async function getConversationById(req, res) {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id)
      .populate('users');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is part of the conversation
    if (!conversation.users.some(u => u._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'You are not part of this conversation' });
    }

    res.json(conversation);
  } catch (err) {
    console.error('Get conversation error:', err);
    res.status(500).json({ message: err.message });
  }
}

// Delete conversation (optional)
async function deleteConversation(req, res) {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Only admin or conversation participants can delete
    if (!conversation.users.includes(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this conversation' });
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ conversationId: id });

    // Delete the conversation
    await Conversation.findByIdAndDelete(id);

    res.json({ message: 'Conversation deleted successfully' });
  } catch (err) {
    console.error('Delete conversation error:', err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { 
  createConversation, 
  listConversations, 
  getConversationById,
  deleteConversation ,
};