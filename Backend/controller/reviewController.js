const Review = require('../models/Review');

// Add a new review
async function addReview(req, res) {
  try {
    const { productId, rating, comment } = req.body;
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      productId, 
      userId: req.user._id 
    });
    
    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this product' 
      });
    }

    const review = await Review.create({ 
      productId, 
      userId: req.user._id, 
      rating, 
      comment 
    });

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'firstName lastName email');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all reviews for a product
async function getProductReviews(req, res) {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update a review
async function updateReview(req, res) {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user owns this review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'firstName lastName email');

    res.json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete a review
async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user owns this review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { 
  addReview, 
  getProductReviews, 
  updateReview, 
  deleteReview 
};