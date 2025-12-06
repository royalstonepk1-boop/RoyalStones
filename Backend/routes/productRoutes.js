const express = require('express');
const router = express.Router();
const { createProduct, listProducts, getProduct, updateProduct, deleteProduct } = require('../controller/productController');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// public
router.get('/', listProducts);
router.get('/:id', getProduct);

// admin
router.post('/', authMiddleware, adminOnly, upload.array('images', 8), createProduct);
router.put('/:id', authMiddleware, adminOnly, upload.array('images', 8), updateProduct);
router.delete('/:id', authMiddleware, adminOnly, deleteProduct);

module.exports = router;
