const express = require('express');
const router = express.Router();
const { createCategory, listCategories, getCategory, updateCategory, deleteCategory } = require('../controller/categoryController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', listCategories);
router.post('/', authMiddleware, adminOnly, createCategory);
router.get('/:id', getCategory);
router.put('/:id', authMiddleware, adminOnly, updateCategory);
router.delete('/:id', authMiddleware, adminOnly, deleteCategory);

module.exports = router;
