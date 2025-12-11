import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

export default function ProductDetails() {
  const { id } = useParams();
  const { product, getProductById, loading } = useProductStore();
  const user = useAuthStore((s) => s.user);
  const addToCart = useCartStore((s) => s.addToCart);
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    getProductById(id);
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      return navigate("/login");
    }
    setAddingToCart(true);
    try {
      await addToCart(product._id, 1);
      alert("Added to Cart!");
    } catch (error) {
      alert("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      return navigate("/login");
    }
    setAddingToCart(true);
    try {
      await addToCart(product._id, 1);
      navigate("/cart");
    } catch (error) {
      alert("Failed to proceed");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = () => {
    if (!user) {
      return navigate("/login");
    }
    // Add wishlist logic here
    console.log("Add to wishlist", product._id);
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  const images = product?.images || [];
  const name = product?.name || "Product Name";
  const price = product?.price || 0;
  const discountPrice = product?.discountPrice;
  const stockQuantity = product?.stockQuantity ?? 0;
  const description = product?.description || "No description available.";
  const isActive = product?.isActive ?? true;
  const currentImage = images[selectedImage]?.url || "/images/placeholder.png";
  const isOutOfStock = stockQuantity === 0 || !isActive;

  return (
    <>
      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-60 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
            onClick={() => {setIsZoomed(false); setSelectedImage(0);}}
          >
            <i className="bi bi-x cursor-pointer"></i>
          </button>
          
          {/* Previous Image */}
          {selectedImage > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage - 1);
              }}
              className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10"
            >
              <i className="bi bi-chevron-left cursor-pointer"></i>
            </button>
          )}
          
          {/* Zoomed Image */}
          <img
            src={currentImage}
            alt={name}
            className="min-w-[40%] min-h-[40%] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Next Image */}
          {selectedImage < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage + 1);
              }}
              className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10"
            >
              <i className="bi bi-chevron-right cursor-pointer"></i>
            </button>
          )}
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* Left Side - Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                  <img
                    src={currentImage}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                  {discountPrice && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-md font-semibold">
                      Sale
                    </span>
                  )}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl">
                        OUT OF STOCK
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setIsZoomed(true)}
                    className="absolute top-4 right-4 bg-white  rounded-[50%] min-w-[50px] min-h-[50px] shadow-md hover:bg-gray-100 transition-colors cursor-pointer"
                    aria-label="Zoom image"
                  >
                    <i className="bi bi-arrows-fullscreen text-sm"></i>
                  </button>
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {images.slice(0, 8).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`cursor-pointer relative bg-gray-100 rounded-lg overflow-hidden aspect-square border-2 transition-all hover:border-gray-400 ${
                          selectedImage === index ? "border-blue-600" : "border-transparent"
                        }`}
                      >
                        <img
                          src={image.url || "/images/placeholder.png"}
                          alt={`${name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side - Product Info */}
              <div className="space-y-6">
                {/* Product Title */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill text-sm"></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(24 reviews)</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  {discountPrice ? (
                    <>
                      <span className="text-3xl font-bold text-gray-900">
                        Rs {discountPrice.toLocaleString()}
                      </span>
                      <span className="text-xl line-through text-gray-400">
                        Rs {price.toLocaleString()}
                      </span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-semibold">
                        {Math.round(((price - discountPrice) / price) * 100)}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      Rs {price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {isOutOfStock ? (
                    <>
                      <i className="bi bi-x-circle-fill text-red-600"></i>
                      <span className="text-red-700 font-medium">Out of stock</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle-fill text-green-600"></i>
                      <span className="text-green-700 font-medium">
                        In stock ({stockQuantity} available)
                      </span>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock || addingToCart}
                      className="flex-1 bg-gray-900 text-white cursor-pointer py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {addingToCart ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cart-plus text-xl"></i>
                          ADD TO CART
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={isOutOfStock || addingToCart}
                      className="flex-1 bg-amber-500 text-white cursor-pointer py-3 px-6 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      BUY NOW
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(-1)}
                      className="flex-1 border-2 border-gray-300 cursor-pointer py-2 px-4 rounded-lg font-medium hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <i className="bi bi-arrow-left"></i>
                      Back
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="border-t pt-6">
                  <div className="space-y-3">
                    {product?.categoryId && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">
                          {typeof product.categoryId === 'object' ? product.categoryId.name : product.categoryId}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Availability:</span>
                      <span className="font-medium">{isActive ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {description && (
                  <div className="border-t pt-6">
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="flex items-center justify-between w-full mb-4 cursor-pointer"
                    >
                      <h2 className="text-xl font-bold text-gray-900">Description</h2>
                      <i className={`bi bi-chevron-${showFullDescription ? 'up' : 'down'} text-xl`}></i>
                    </button>
                    
                    <div className={`text-gray-700 leading-relaxed whitespace-pre-line ${
                      showFullDescription ? '' : 'line-clamp-4'
                    }`}>
                      {description}
                    </div>
                    
                    {!showFullDescription && description.length > 200 && (
                      <button
                        onClick={() => setShowFullDescription(true)}
                        className="text-blue-600 hover:text-blue-700 font-medium mt-2 cursor-pointer"
                      >
                        Read more
                      </button>
                    )}
                  </div>
                )}

                {/* Trust Badges */}
                <div className="border-t pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-2">
                      <i className="bi bi-truck text-3xl text-gray-700"></i>
                      <p className="text-xs font-medium">Free Shipping</p>
                    </div>
                    <div className="space-y-2">
                      <i className="bi bi-shield-check text-3xl text-gray-700"></i>
                      <p className="text-xs font-medium">Secure Payment</p>
                    </div>
                    <div className="space-y-2">
                      <i className="bi bi-arrow-repeat text-3xl text-gray-700"></i>
                      <p className="text-xs font-medium">Easy Returns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}