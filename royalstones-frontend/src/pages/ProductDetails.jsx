import { useState, useEffect } from "react";
import { useParams, useNavigate ,useLocation } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import PageWrapper from "../util/PageWrapper";
import { toast } from 'react-toastify';
import RangeSlider from "./RangeSlider";
import { ProductReviews, RatingSummary } from './ProductReviews'
import ProductList from "../components/product/ProductList";

export default function ProductDetails() {
  const { id } = useParams();
  const { product, getProductById, getProductsByCategory, loading } = useProductStore();
  const user = useAuthStore((s) => s.user);
  const addToCart = useCartStore((s) => s.addToCart);
  const openCart = useCartStore((s) => s.openCart);
  const navigate = useNavigate();
  const location = useLocation();
  const {products, catData ,cat} = location.state || {};

  // const exceptSelectedProduct = products?.filter(p =>p._id !== product?._id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyNow, setBuyNow] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [error, setError] = useState('');
  const [fingerSize, setFingerSize] = useState('');
  const [msgNote, setMsgNote] = useState('');
  const [carret, setCarret] = useState(product?.carretRate?.min || 1);

  useEffect(() => {
    getProductById(id);
  }, [id]);

  useEffect(() =>
    setCarret(product?.carretRate?.min || 1)
    , [product]);

    
  const handleChange = (e) => {
    const size = parseFloat(e.target.value);

    if (e.target.value === '') {
      setError('');
      return;
    }

    if (size < 12) {
      setError('Minimum size is 12mm');
    } else if (size > 25) {
      setError('Maximum size is 25mm');
    } else {
      setError('');
    }
    // console.log(typeof(fingerSize),typeof(size));
    setFingerSize(size);
  };

  const handleAddToCart = async () => {
    // if (!user) {
    //   return navigate("/login");
    // }
    if (product?.categoryId?.hasFingerSize && (!fingerSize || fingerSize < 12 || fingerSize > 25 || fingerSize === '')) {
      setError('Please enter a valid finger size between 12mm and 25mm');
      return;
    }
    setAddingToCart(true);
    try {
      //console.log(carret);
      await addToCart(product._id, 1, fingerSize, carret, msgNote);
      toast.success("Added To Cart!", {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } catch (error) {
      toast.error(err.message, {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } finally {
      setAddingToCart(false);
      setFingerSize('');
      setMsgNote('');
    }
  };

  const handleBuyNow = async () => {
    // if (!user) {
    //   return navigate("/login");
    // }
    if (product?.categoryId?.hasFingerSize && (!fingerSize || fingerSize < 12 || fingerSize > 25 || fingerSize === '')) {
      setError('Please enter a valid finger size between 12mm and 25mm');
      return;
    }

    setBuyNow(true);
    try {
      await addToCart(product._id, 1, fingerSize, carret, msgNote);
      openCart();
    } catch (error) {
      toast.error(err.message, {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } finally {
      setBuyNow(false);
      setFingerSize('');
      setMsgNote('');
    }
  };

  // const handleAddToWishlist = () => {
  //   if (!user) {
  //     return navigate("/login");
  //   }
  //   // Add wishlist logic here
  //   console.log("Add to wishlist", product._id);
  // };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen flex items-start justify-center">
        <div className="text-center">
          <p className="mt-16 text-gray-600">Product not found.</p>
        </div>
      </div>
    );
  }
  const handleSetCarret = (val) => {
    setCarret(val);
  }

  const images = product?.images || [];
  const name = product?.name || "Product Name";
  const vedioUrl = product?.vedioUrl || null;
  const price = product?.price || 0;
  const discountPrice = product?.discountPrice;
  const stockQuantity = product?.stockQuantity ?? 0;
  const description = product?.description || "No description available.";
  const isActive = product?.isActive ?? true;
  const currentImage = images[selectedImage]?.url || "/images/placeholder.png";
  const isOutOfStock = stockQuantity === 0 || !isActive;

  return (
    <>
      <PageWrapper>
        {/* Zoom Modal */}
        {isZoomed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 z-100 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
              onClick={() => { setIsZoomed(false); setSelectedImage(0); }}
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
              className="max-w-[90%] max-h-[90%] object-contain"
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
                      onClick={() => setIsZoomed(true)}
                      className="w-full h-full object-cover border-1 cursor-pointer border-gray-400 rounded-[15px]"
                    />
                    {/* {discountPrice && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-md font-semibold">
                      Sale
                    </span>
                  )} */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl">
                          OUT OF STOCK
                        </span>
                      </div>
                    )}
                    {/* <button
                    onClick={() => setIsZoomed(true)}
                    className="absolute top-4 right-4 bg-white  rounded-[50%] min-w-[50px] min-h-[50px] shadow-md hover:bg-gray-100 transition-colors cursor-pointer"
                    aria-label="Zoom image"
                  >
                    <i className="bi bi-arrows-fullscreen text-sm"></i>
                  </button> */}
                  </div>

                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {images.slice(0, 8).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`cursor-pointer relative bg-gray-100 rounded-lg overflow-hidden aspect-square border-2 transition-all hover:border-gray-400 ${selectedImage === index ? "border-blue-600" : "border-transparent"
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
                  <div className="flex gap-4 flex-wrap">
                    <h1 className="text-md md:text-3xl font-bold text-gray-900 mb-2 break-words whitespace-normal w-[100%]">
                      {name}
                    </h1>

                    {
                      vedioUrl !== null &&
                      <h1 className="text-sm md:text-md font-bold text-blue-600 mt-2 hover:text-blue-900 hover:transform duration-150 cursor-pointer"
                        onClick={() => window.open(vedioUrl, '_blank')}>
                        Click to view vedio
                      </h1>
                    }

                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    {discountPrice ? (
                      <>
                        <span className="text-xl md:text-3xl font-bold text-gray-900">
                          Rs {(discountPrice * carret).toLocaleString()}
                        </span>
                        <span className="text-md md:text-xl line-through text-gray-400">
                          Rs {(price * carret).toLocaleString()}
                        </span>
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-semibold">
                          {Math.round(((price - discountPrice) / price) * 100)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-xl md:text-3xl font-bold text-gray-900">
                        Rs {(price * carret).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Dynamic Star Rating */}
                  <RatingSummary productId={product._id} />

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
                        <span className="text-green-700 font-medium text-sm md:text-lg">
                          In stock ({stockQuantity} available)
                        </span>
                      </>
                    )}
                  </div>

                  {/* For Finger Size */}
                  {
                    product?.categoryId?.hasFingerSize &&
                    <input
                      type="number"
                      value={fingerSize}
                      onChange={handleChange}
                      min="14"
                      max="23"
                      step="0.5"
                      placeholder="Please Enter Finger size e.g; 16.5mm"
                      className={`w-full pl-5 pr-12 py-3 border rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                  }
                  {
                    error && <p className="text-red-500 text-sm ">{error}</p>
                  }

                  <RangeSlider min={product?.carretRate?.min} max={product?.carretRate?.max} setCarret={handleSetCarret} />


                  <input
                    type="text"
                    value={msgNote}
                    onChange={(e) => setMsgNote(e.target.value)}
                    placeholder="Enter instructions or message(optional)"
                    className={`w-full pl-5 pr-12 py-3 border rounded-lg text-sm md:textl-lg focus:ring-1 focus:ring-gray-400 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {
                      user?.role !== 'admin' &&
                      <div className="flex gap-3">
                        <button
                          onClick={handleAddToCart}
                          disabled={isOutOfStock || addingToCart}
                          className="flex-1 bg-gray-900 text-white cursor-pointer py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-lg"
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
                          disabled={isOutOfStock || buyNow}
                          className="flex-1 bg-amber-500 text-white cursor-pointer py-3 px-6 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-lg"
                        >
                          {buyNow ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Adding...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-cart-plus text-xl"></i>
                              BUY NOW
                            </>
                          )}
                        </button>
                      </div>
                    }


                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(-1)}
                        className="flex-1 border-2 border-gray-300 cursor-pointer py-2 px-4 rounded-lg font-medium text-sm md:text-lg hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <i className="bi bi-arrow-left"></i>
                        Back
                      </button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="border-t border-gray-400 pt-6">
                    <div className="space-y-3">
                      {product?.categoryId && (
                        <div className="flex justify-between py-2 text-sm md:text-base whitespace-normal">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium break-words w-[85%] pl-2 mr-4">
                            {typeof product.categoryId === 'object' ? product.categoryId.name : product.categoryId}
                          </span>
                        </div>
                      )}
                      {/* <div className="flex justify-between py-2">
                        <span className="text-gray-600">Availability:</span>
                        <span className="font-medium">{isActive ? "Active" : "Inactive"}</span>
                      </div> */}
                    </div>
                  </div>

                  {/* Description */}
                  {description && (
                    <div className="border-t border-gray-400 pt-6 text-sm md:text-base">
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="flex items-center justify-between w-full mb-4 cursor-pointer"
                      >
                        <h2 className="text-sm md:text-xl font-bold text-gray-900">Description</h2>
                        <i className={`bi bi-chevron-${showFullDescription ? 'up' : 'down'} text-xl`}></i>
                      </button>

                      <div className={`text-gray-700 leading-relaxed whitespace-pre-line break-words w-[100%] ${showFullDescription ? '' : 'line-clamp-4'
                        }`}>
                        {description.split(/(\*\*.*?\*\*)/).map((part, index) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={index}>{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        })}
                      </div>

                      {!showFullDescription && description.length > 200 && (
                        <button
                          onClick={() => setShowFullDescription(true)}
                          className="text-blue-600 hover:text-blue-700 font-medium mt-2 text-xs md:text-sm cursor-pointer"
                        >
                          Read more
                        </button>
                      )}
                    </div>
                  )}
                  {/* Certificate Image */}
                  {product?.certificateImage && (
                    <div className="my-12 pt-6 border-t border-gray-300 max-h-auto">
                      <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-4">Certificate of Authenticity</h3>
                      <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={product?.certificateImage}
                          alt="Certificate of Authenticity"
                          className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </div>
                    </div>
                  )}
                  {/* Reviews Section */}
                  <ProductReviews productId={product._id} />

                  {/* Trust Badges */}
                  <div className="border-t border-gray-400 pt-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-2">
                        <i className="bi bi-truck text-xl md:text-3xl text-gray-700"></i>
                        <p className="text-xs font-medium">Free Shipping</p>
                      </div>
                      <div className="space-y-2">
                        <i className="bi bi-shield-check text-xl md:text-3xl text-gray-700"></i>
                        <p className="text-xs font-medium">Secure Payment</p>
                      </div>
                      <div className="space-y-2">
                        <i className="bi bi-arrow-repeat text-xl md:text-3xl text-gray-700"></i>
                        <p className="text-xs font-medium">Easy Returns</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          products && products.length > 0 && cat && 
          <div className="max-w-7xl mx-auto px-4 mt-4 sm:px-6 lg:px-8 mb-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">More products in {cat?.name}</h2>
        <ProductList products={products} catData={catData} getProductsByCategory={getProductsByCategory} cat={cat} />
        </div>
        }
      </PageWrapper>
    </>
  );
}
