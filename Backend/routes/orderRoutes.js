const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, updateOrderStatus ,cancelOrder ,listOrders } = require('../controller/orderController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getOrders);
router.get('/', authMiddleware, listOrders);
router.get('/:id', authMiddleware, getOrder);
router.put('/:id', authMiddleware, cancelOrder);
router.put('/:id/status', authMiddleware, adminOnly, updateOrderStatus);

module.exports = router;
