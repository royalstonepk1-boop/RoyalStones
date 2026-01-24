const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InventoryLogSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  changeType: { type: String, enum: ['order', 'cancel', 'restock', 'manual'] },
  quantityChange: Number,
  note: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InventoryLog', InventoryLogSchema);
