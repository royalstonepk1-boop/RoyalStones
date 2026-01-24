const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
  charges:{type: Number, required: true},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Delivery', DeliverySchema);
