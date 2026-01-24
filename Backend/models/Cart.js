const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItem = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
  fingerSize:{ type: Number, default: 1},
  carretValue:{ type: Number, default: 1},
  msgNote:{ type: String, default: ''},
});

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
  items: [CartItem],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', CartSchema);
