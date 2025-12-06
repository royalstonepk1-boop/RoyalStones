const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminLogSchema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: 'User' },
  action: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AdminLog', AdminLogSchema);
