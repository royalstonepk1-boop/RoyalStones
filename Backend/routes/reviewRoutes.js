const express = require('express');
const router = express.Router();
const { 
  addReview, 
  getProductReviews, 
  updateReview, 
  deleteReview 
} = require('../controller/reviewController');
const { authMiddleware } = require('../middleware/auth');

// Get all reviews for a product (public)
router.get('/:productId', getProductReviews);

// Add a review (authenticated)
router.post('/', authMiddleware, addReview);

// Update a review (authenticated)
router.put('/:reviewId', authMiddleware, updateReview);

// Delete a review (authenticated)
router.delete('/:reviewId', authMiddleware, deleteReview);

module.exports = router;