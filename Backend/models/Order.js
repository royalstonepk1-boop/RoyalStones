const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSub = new Schema({
  fullName: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
});

const OrderItem = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  price: Number,
  quantity: Number,
  carretValue:Number,
  fingerSize :Number,
  msgNote: String,
});

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  orderNumber:Number,
  status: { type: String, enum: ['pending', 'paid', 'in_transit', 'delivered', 'cancelled'], default: 'pending' },
  billingAddress: AddressSub,
  shippingAddress: AddressSub,
  paymentMethod: { type: String, enum: ['full_advance', 'cod'] },
  totalAmount: Number,
  deliveryCharges: Number,
  orderItems: [OrderItem],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
