const Conversation = require('../models/Conversation');

async function createConversation(req, res) {
  const { users } = req.body; // array of userIds
  const conv = await Conversation.create({ users });
  res.json(conv);
}

async function listConversations(req, res) {
  const convs = await Conversation.find({ users: req.user._id }).populate('users');
  res.json(convs);
}

module.exports = { createConversation, listConversations };
