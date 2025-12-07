const User = require('../models/User');
const Conversation = require('../models/Conversation');

async function createConversation(req, res) {
  try {
    const { userId, adminId } = req.body;

    const user = await User.findById(userId);
    const admin = await User.findById(adminId);

    if (!user || !admin) {
      return res.status(404).json({ message: "User/Admin not found" });
    }

    if (user.role !== 'user') {
      return res.status(400).json({ message: "First person must be a user" });
    }

    if (admin.role !== 'admin') {
      return res.status(400).json({ message: "Second person must be an admin" });
    }

    const existing = await Conversation.findOne({
      users: { $all: [userId, adminId] }
    });

    if (existing) {
      return res.json(existing);
    }

    const conversation = await Conversation.create({
      users: [userId, adminId]
    });

    res.json(conversation);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


async function listConversations(req, res) {
  const convs = await Conversation.find({ users: req.user._id }).populate('users');
  res.json(convs);
}

module.exports = { createConversation, listConversations };
