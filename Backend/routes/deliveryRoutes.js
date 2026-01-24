const express = require('express');
const router = express.Router();
const { getDeliveryCharges, updateDeliveryCharges ,addDeliveryCharges } = require('../controller/deliveryController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, addDeliveryCharges);
router.put('/', authMiddleware, updateDeliveryCharges);
router.get('/', getDeliveryCharges);

module.exports = router;
