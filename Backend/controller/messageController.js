const Message = require('../models/Message');

async function sendMessage(req, res) {
  const { conversationId, message } = req.body;
  const msg = await Message.create({ conversationId, senderId: req.user._id, message });
  res.json(msg);
}

async function getMessages(req, res) {
  const { conversationId } = req.params;
  const msgs = await Message.find({ conversationId }).sort({ createdAt: 1 }).populate('senderId');
  res.json(msgs);
}

module.exports = { sendMessage, getMessages };
