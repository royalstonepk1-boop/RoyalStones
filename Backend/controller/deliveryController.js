const Delivery = require('../models/Delivery');

async function updateDeliveryCharges(req, res) {
  const { id ,charges } = req.body;
  const r = await Delivery.findOneAndUpdate({_id:id}, { $set: { charges: charges } });
  res.json(r);
}

async function addDeliveryCharges(req, res) {
  const { charges } = req.body;
  const r = await Delivery.create({charges: charges});
  res.json(r);
}

async function getDeliveryCharges(req, res) {
  const deliveryCharges = await Delivery.find();
  res.json(deliveryCharges);
}

module.exports = { getDeliveryCharges, updateDeliveryCharges ,addDeliveryCharges };
