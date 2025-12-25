const express = require('express');
const router = express.Router();
const striptest = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createOrder, getOrders, getOrder, updateOrderStatus ,cancelOrder ,listOrders ,paymentCheckOutSession } = require('../controller/orderController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getOrders);
router.get('/', authMiddleware, listOrders);
router.get('/:id', authMiddleware, getOrder);
router.put('/:id', authMiddleware, cancelOrder);
router.put('/:id/status', authMiddleware, adminOnly, updateOrderStatus);

router.post('/create-checkout-session', authMiddleware, paymentCheckOutSession);


module.exports = router;
