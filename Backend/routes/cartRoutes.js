const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFullSingleItem, clearCart } = require('../controller/cartController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);
router.put('/remove', authMiddleware, removeFullSingleItem);
router.put('/update', authMiddleware, updateCartItem);
router.post('/clear', authMiddleware, clearCart);

module.exports = router;
