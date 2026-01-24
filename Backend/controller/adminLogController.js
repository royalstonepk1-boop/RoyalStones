const AdminLog = require('../models/AdminLog');

async function listAdminLogs(req, res) {
  const logs = await AdminLog.find().populate('adminId');
  res.json(logs);
}

module.exports = { listAdminLogs };
