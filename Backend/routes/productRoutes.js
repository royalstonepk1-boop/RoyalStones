const express = require('express');
const router = express.Router();
const { createProduct, listProducts,listProductsForNavBar, getProduct, updateProduct, deleteProduct ,countByCategory } = require('../controller/productController');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// public
router.get('/navbar', listProductsForNavBar);
router.get('/', listProducts);
router.get('/:id', getProduct);

// admin
router.post('/', authMiddleware, adminOnly, upload.fields([
    { name: 'images', maxCount: 8 },
    { name: 'certificateImage', maxCount: 1 }
  ]), createProduct);

router.put('/:id', authMiddleware, adminOnly, upload.fields([
    { name: 'images', maxCount: 8 },
    { name: 'certificateImage', maxCount: 1 }
  ]), updateProduct);
  
router.delete('/:id', authMiddleware, adminOnly, deleteProduct);
// Get product count by category
router.get('/count-by-category/:categoryId',authMiddleware, adminOnly,  countByCategory);

module.exports = router;
