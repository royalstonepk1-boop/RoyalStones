const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({ url: String, isPrimary: { type: Boolean, default: false } });

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: String,
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  price: Number,
  discountPrice: Number,
  isActive: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0 },
  vedioUrl: String,
  carretRate: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },
  certificateImage: String,
  images: [ImageSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);
