const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', ReviewSchema);
