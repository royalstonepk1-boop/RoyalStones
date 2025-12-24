import api from "./axios";

export const getProductReviewsApi = (productId) => 
  api.get(`/reviews/${productId}`);

export const addReviewApi = (productId, rating, comment) => 
  api.post("/reviews", { productId, rating, comment });

export const updateReviewApi = (reviewId, rating, comment) => 
  api.put(`/reviews/${reviewId}`, { rating, comment });

export const deleteReviewApi = (reviewId) => 
  api.delete(`/reviews/${reviewId}`);