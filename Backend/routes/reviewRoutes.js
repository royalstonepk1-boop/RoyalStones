const express = require('express');
const router = express.Router();
const { addReview, getProductReviews } = require('../controller/reviewController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, addReview);
router.get('/:productId', getProductReviews);

module.exports = router;
