const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  users: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    validate: {
      validator: function (value) {
        return value.length === 2;
      },
      message: 'Conversation must have exactly 2 users (user and admin)'
    }
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Conversation', ConversationSchema);
