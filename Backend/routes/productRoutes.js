// productRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createProduct, 
  listProducts,
  listProductsForNavBar, 
  getProduct, 
  updateProduct, 
  deleteProduct,
  countByCategory 
} = require('../controller/productController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/navbar', listProductsForNavBar);
router.get('/', listProducts);
router.get('/:id', getProduct);

// Admin routes - NO MORE upload.fields() middleware!
router.post('/', authMiddleware, adminOnly, createProduct);
router.put('/:id', authMiddleware, adminOnly, updateProduct);
router.delete('/:id', authMiddleware, adminOnly, deleteProduct);
router.get('/count-by-category/:categoryId', authMiddleware, adminOnly, countByCategory);

module.exports = router;