const express = require('express');
const router = express.Router();
const { listAdminLogs } = require('../controller/adminLogController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, adminOnly, listAdminLogs);

module.exports = router;
