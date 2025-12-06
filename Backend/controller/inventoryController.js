const InventoryLog = require('../models/InventoryLog');

async function listInventoryLogs(req, res) {
  const logs = await InventoryLog.find().populate('productId');
  res.json(logs);
}

module.exports = { listInventoryLogs };
