const Review = require('../models/Review');

async function addReview(req, res) {
  const { productId, rating, comment } = req.body;
  const r = await Review.create({ productId, userId: req.user._id, rating, comment });
  res.json(r);
}

async function getProductReviews(req, res) {
  const reviews = await Review.find({ productId: req.params.productId }).populate('userId');
  res.json(reviews);
}

module.exports = { addReview, getProductReviews };
