import { useState, useEffect } from "react";
import { useReviewStore } from "../store/reviewStore";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

// Star Rating Display Component
export const StarRating = ({ rating, size = "text-xl", showNumber = false }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <i key={`full-${i}`} className={`bi bi-star-fill text-yellow-400 ${size}`}></i>
      ))}
      {hasHalfStar && (
        <i className={`bi bi-star-half text-yellow-400 ${size}`}></i>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <i key={`empty-${i}`} className={`bi bi-star text-gray-300 ${size}`}></i>
      ))}
      {showNumber && (
        <span className="ml-2 text-gray-600 font-medium">{rating}</span>
      )}
    </div>
  );
};

// Star Rating Input Component
const StarRatingInput = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 cursor-pointer"
        >
          <i
            className={`bi bi-star-fill text-3xl ${
              star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          ></i>
        </button>
      ))}
    </div>
  );
};

// Review Form Component
const ReviewForm = ({ productId, existingReview, onClose }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [submitting, setSubmitting] = useState(false);
  const { addReview, updateReview } = useReviewStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);

    let result;
    if (existingReview) {
      result = await updateReview(existingReview._id, productId, rating, comment);
    } else {
      result = await addReview(productId, rating, comment);
    }

    setSubmitting(false);

    if (result.success) {
      toast.success(existingReview ? "Review updated!" : "Review added!");
      onClose();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-gray-900">
        {existingReview ? "Edit Your Review" : "Write a Review"}
      </h3>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Your Rating *
        </label>
        <StarRatingInput rating={rating} onRatingChange={setRating} />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Your Review(optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={170}
          placeholder="Share your experience with this product..."
          className="w-full px-4 py-2 border text-sm md:text-md border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-xs md:text-base font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-xs md:text-base  hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Individual Review Item Component
const ReviewItem = ({ review, isUserReview, productId, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteReview } = useReviewStore();

  const handleDelete = async () => {
    toast.warning(
        ({ closeToast }) => (
          <div>
            <p className="mb-3">Are you sure you want to delete this Review?</p>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                    setIsDeleting(true);
                    const result = await deleteReview(review._id, productId);
                  closeToast();
                  if (result.success) {
                  toast.success("Review deleted!", {
                    position: "top-right",
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                  });
                  setIsDeleting(false);
                }}}
                className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Delete
              </button>
              <button
                onClick={closeToast}
                className="bg-gray-500 hover:bg-gray-600 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        {
          position: "top-center",
          autoClose: false,
          closeButton: false,
          draggable: false,
        }
      );
  };

  return (
    <div className="border-b border-gray-200 pb-6 last:border-0">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-3 mb-2 text-sm md:text-base">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {review.userId?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {review.userId?.name}
              </p>
              <p className="text-xs md:text-base text-gray-500">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <StarRating rating={review.rating} size="text-sm" />
        </div>

        {isUserReview && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium cursor-pointer"
            >
              <i className="bi bi-pencil-square mr-1"></i>
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700 text-xs md:text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
              <i className="bi bi-trash mr-1"></i>
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-700 leading-relaxed break-words w-[100%] text-xs md:text-base">{review.comment}</p>
    </div>
  );
};

// Main Product Reviews Component
export const ProductReviews = ({ productId }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  
  const user = useAuthStore((s) => s.user);
  const {
    reviews,
    averageRating,
    totalReviews,
    ratingDistribution,
    loading,
    userReview,
    fetchProductReviews,
    setUserReview,
  } = useReviewStore();

  useEffect(() => {
    fetchProductReviews(productId);
  }, [productId]);

  useEffect(() => {
    if (user) {
      setUserReview(user._id);
    }
  }, [reviews, user]);

  const handleAddReview = () => {
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }
    setShowReviewForm(true);
    setEditingReview(null);
  };

  const handleEditReview = () => {
    setEditingReview(userReview);
    setShowReviewForm(true);
  };

  const handleCloseForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };
  const handleShowReview = () => {
    setShowReviews(!showReviews);
  };

  return (
    <div className="border-t border-gray-400 pt-6 space-y-6">
      {/* Rating Overview */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-2">Customer Reviews</h3>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="text-2xl md:text-4xl font-bold text-gray-900">{averageRating}</span>
              <div>
                <StarRating rating={parseFloat(averageRating)} size="text-md md:text-2xl" />
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          {
            showReviewForm &&
            <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-8">{star} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-yellow-400 h-2.5 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>
          }
          
        </div>

        {/* Add Review Button */}
        {!userReview && !showReviewForm && (
          <button
            onClick={handleAddReview}
            className="mt-6 w-full md:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-xs md:text-base hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <i className="bi bi-pencil-square mr-2"></i>
            Write a Review
          </button>
        )}
        <button
            onClick={handleShowReview}
            className="mt-6 w-full md:w-auto bg-blue-600 text-white py-3 px-6 mx-4 rounded-lg font-semibold text-xs md:text-base hover:bg-blue-700 transition-colors cursor-pointer"
          >
            See Reviews ({totalReviews})
            {
              showReviews ? <i class="bi bi-chevron-down"></i> : <i class="bi bi-chevron-up"></i>
            }
          </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          productId={productId}
          existingReview={editingReview}
          onClose={handleCloseForm}
        />
      )}

      {/* Reviews List */}
      <div>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm md:text-base">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <i className="bi bi-chat-square-text text-5xl text-gray-400 mb-4"></i>
            <p className="text-gray-600 text-sm md:text-base">No reviews yet</p>
            <p className="text-gray-500 text-xs md:text-sm mt-2">Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-6 max-h-[300px] overflow-y-auto">
            {showReviews && reviews.map((review) => (
              <ReviewItem
                key={review._id}
                review={review}
                isUserReview={user && (review.userId?._id === user._id || user.role === 'admin')}
                productId={productId}
                onEdit={handleEditReview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const RatingSummary = ({ productId }) => {
    const { averageRating, totalReviews, fetchProductReviews } = useReviewStore();
  
    useEffect(() => {
      fetchProductReviews(productId);
    }, [productId]);
  
    if (totalReviews === 0) {
      return (
        <span className="text-sm text-gray-500">No reviews yet</span>
      );
    }
  
    return (
      <div className="flex items-center gap-2">
        <StarRating rating={parseFloat(averageRating)} size="text-lg" showNumber={true} />
        <span className="text-sm text-gray-600">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
      </div>
    );
  };