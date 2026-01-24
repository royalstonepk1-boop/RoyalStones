const express = require('express');
const router = express.Router();
const { listInventoryLogs } = require('../controller/inventoryController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, adminOnly, listInventoryLogs);

module.exports = router;
