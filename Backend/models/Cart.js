const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItem = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
});

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
  items: [CartItem],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', CartSchema);
