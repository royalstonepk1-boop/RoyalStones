import { create } from "zustand";
import { 
  getProductReviewsApi, 
  addReviewApi, 
  updateReviewApi, 
  deleteReviewApi 
} from "../api/review.api";

export const useReviewStore = create((set, get) => ({
  reviews: [],
  averageRating: 0,
  totalReviews: 0,
  ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  loading: false,
  userReview: null,

  // Fetch all reviews for a product
  fetchProductReviews: async (productId) => {
    set({ loading: true });
    try {
      const res = await getProductReviewsApi(productId);
      const reviews = res.data;
      
      // Calculate statistics
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : 0;
      
      // Calculate rating distribution
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach(r => {
        distribution[r.rating] = (distribution[r.rating] || 0) + 1;
      });

      set({ 
        reviews, 
        averageRating: averageRating.toFixed(1),
        totalReviews,
        ratingDistribution: distribution,
        loading: false 
      });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch reviews:', error);
    }
  },

  // Add a new review
  addReview: async (productId, rating, comment) => {
    set({ loading: true });
    try {
      const res = await addReviewApi(productId, rating, comment);
      const newReview = res.data;
      
      set((state) => ({
        reviews: [newReview, ...state.reviews],
        userReview: newReview,
        loading: false
      }));
      
      // Refresh to recalculate stats
      await get().fetchProductReviews(productId);
      return { success: true };
    } catch (error) {
      set({ loading: false });
      console.error('Failed to add review:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to add review' };
    }
  },

  // Update existing review
  updateReview: async (reviewId, productId, rating, comment) => {
    set({ loading: true });
    try {
      const res = await updateReviewApi(reviewId, rating, comment);
      const updatedReview = res.data;
      
      set((state) => ({
        reviews: state.reviews.map(r => 
          r._id === reviewId ? updatedReview : r
        ),
        userReview: updatedReview,
        loading: false
      }));
      
      // Refresh to recalculate stats
      await get().fetchProductReviews(productId);
      return { success: true };
    } catch (error) {
      set({ loading: false });
      console.error('Failed to update review:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to update review' };
    }
  },

  // Delete review
  deleteReview: async (reviewId, productId) => {
    set({ loading: true });
    try {
      await deleteReviewApi(reviewId);
      
      set((state) => ({
        reviews: state.reviews.filter(r => r._id !== reviewId),
        userReview: null,
        loading: false
      }));
      
      // Refresh to recalculate stats
      await get().fetchProductReviews(productId);
      return { success: true };
    } catch (error) {
      set({ loading: false });
      console.error('Failed to delete review:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to delete review' };
    }
  },

  // Check if current user has already reviewed
  setUserReview: (userId) => {
    const reviews = get().reviews;
    const userReview = reviews.find(r => r.userId?._id === userId);
    set({ userReview });
  },

  // Reset store
  resetReviews: () => set({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    userReview: null
  })
}));