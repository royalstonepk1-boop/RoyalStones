const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },

  // New fields
  hasFingerSize: { type: Boolean, default: false }, // true/false
  carretRate: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Category', CategorySchema);
