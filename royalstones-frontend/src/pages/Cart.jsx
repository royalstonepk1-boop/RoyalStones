// components/CartSidebar.jsx
import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useDeliveryStore } from '../store/deliveryStore';
import { getProductsByIds } from '../api/product.api'; // ✅ Add this API

export default function Cart() {
  const {
    cart,
    loading,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    fetchCart
  } = useCartStore();
  
  const { fetchCharges, charges } = useDeliveryStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  // ✅ State for guest cart with populated products
  const [cartWithProducts, setCartWithProducts] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);

  // console.log(cart, 'cart');

  useEffect(() => {
    fetchCharges();
  }, [cart]);



  useEffect(() => {
    fetchCart();
  }, [isOpen, user]);

  // ✅ Fetch product details for guest cart
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!cart || !cart.items || cart.items.length === 0) {
        setCartWithProducts({ items: [] });
        return;
      }

      // If user is authenticated, cart already has populated products
      if (user) {
        setCartWithProducts(cart);
        return;
      }

      // For guest cart, fetch product details
      setProductsLoading(true);
      try {
        const productIds = cart.items.map(item => item.productId);
        // console.log(productIds);
        const res = await getProductsByIds(productIds);
        
        
        const productsMap = res.data.reduce((acc, product) => {
          acc[product._id] = product;
          return acc;
        }, {});

        const itemsWithProducts = cart.items.map(item => ({
          ...item,
          productId: productsMap[item.productId] || { 
            name: 'Product not found',
            price: 0,
            images: []
          }
        }));

        setCartWithProducts({ ...cart, items: itemsWithProducts });
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setCartWithProducts(cart);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProductDetails();
  }, [cart, user]);

  // ✅ Use cartWithProducts instead of cart for rendering
  const displayCart = cartWithProducts || cart;
  // console.log('displayCart', displayCart ,cartWithProducts,cart);
  const isLoading = loading || productsLoading;

  const total = displayCart?.items?.reduce(
    (sum, item) => {
      const product = item.productId;
      const price = product?.discountPrice || product?.price || 0;
      return sum + price * item.carretValue * item.quantity;
    },
    0
  ) || 0;

  const itemCount = displayCart?.items?.length || 0;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          tabIndex={-1}
          className="fixed inset-0 bg-black opacity-30 z-1001"
          onClick={closeCart}
          onMouseDown={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-1002 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Shopping Cart</h2>
            <p className="text-sm text-gray-500">
              {itemCount > 1 ? `${itemCount} items` : `${itemCount} item`}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="overflow-y-auto p-6 space-y-4" style={{ height: 'calc(100vh - 280px)' }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : !displayCart || displayCart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ShoppingCart size={64} className="text-gray-300 mb-4" />
              <p className="text-md md:text-xl font-semibold text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            displayCart.items.map((item, index) => {
              const product = item.productId;
              const price = product?.discountPrice || product?.price || 0;
              const imageUrl = product?.images?.[0]?.url || '/placeholder.jpg';
              
              return (
                <div key={item._id || index} className="flex gap-4 border border-gray-400 rounded-lg p-4">
                  <img
                    src={imageUrl}
                    alt={product?.name || 'Product'}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-400"
                  />

                  <div className="flex-1 w-[60%]">
                    <h3 className="font-semibold text-sm break-words w-[100%] md:text-md mb-1">
                      {product?.name?.length > 50 ? product?.name?.slice(0,50)+'...' : product?.name|| 'Product'}
                    </h3>
                    <p className="text-sm md:text-md font-bold">
                      Rs {(price * item.carretValue).toLocaleString()}
                    </p>
                    
                    <p className="flex gap-1">
                      {item.fingerSize && (
                        <input
                          type="text"
                          value={`${item.fingerSize} mm`}
                          readOnly
                          className="w-full border-none outline-none rounded-lg text-[12px]"
                        />
                      )}
                      {item.carretValue && (
                        <input
                          type="text"
                          value={`${item.carretValue} Carat`}
                          readOnly
                          className="w-full py-1 border-none outline-none rounded-lg text-[12px]"
                        />
                      )}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(
                            String(product?._id || item.productId),
                            item.quantity - 1,
                            item.fingerSize,
                            item.carretValue
                          )}
                          disabled={isLoading}
                          className="p-1 hover:bg-white rounded disabled:opacity-50"
                        >
                          <Minus size={14} className="cursor-pointer" />
                        </button>
                        <span className="w-8 text-center text-sm md:text-md font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(
                            String(product?._id || item.productId),
                            item.quantity + 1,
                            item.fingerSize,
                            item.carretValue
                          )}
                          disabled={isLoading}
                          className="p-1 hover:bg-white rounded disabled:opacity-50"
                        >
                          <Plus size={14} className="cursor-pointer" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(
                          String(product?._id || item.productId),
                          item.fingerSize,
                          item.carretValue
                        )}
                        disabled={isLoading}
                        className="text-red-500 cursor-pointer hover:text-red-700 p-2 disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {displayCart && displayCart.items.length > 0 && (
          <div className="border-t p-6 bg-gray-50">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">Rs {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span>Shipping Charges</span>
                <span className="font-semibold">Rs {charges.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>Rs {(total + charges).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                console.log('Cart data:', cartWithProducts);
                closeCart();
                navigate('/checkout', { state: { cartWithProducts } });
              }}
              className="w-full bg-black text-white py-4 rounded-lg font-semibold cursor-pointer hover:bg-gray-800"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}