// components/CartSidebar.jsx
import {useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // ✅ Import auth store
import { useNavigate } from 'react-router-dom';
import { useDeliveryStore } from '../store/deliveryStore';

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
  const { fetchCharges,charges } = useDeliveryStore();

  const user = useAuthStore((state) => state.user); // ✅ Get user
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && !user) {
      closeCart();
      navigate('/login');
      return;
    }
      fetchCharges();
    
  }, [])
  

  useEffect(() => {
    // ✅ If cart opens and user not logged in, redirect to login
    if (isOpen && !user) {
      closeCart();
      navigate('/login');
      return;
    }

    // ✅ Only fetch cart if user is logged in
    if (isOpen && user && !cart) {
      fetchCart();
    }
  }, [isOpen, user]);

  if (!user) return null;

  const total = cart?.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  ) || 0;

  const itemCount = cart?.items?.length || 0;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          tabIndex={-1}
          className="fixed inset-0 bg-black opacity-30 z-60"
          onClick={closeCart}
          onMouseDown={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-70 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Shopping Cart</h2>
            <p className="text-sm text-gray-500">{`${itemCount > 1 ? itemCount + " items" : itemCount + " item"}`} </p>
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
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ShoppingCart size={64} className="text-gray-300 mb-4" />
              <p className="text-md md:text-xl font-semibold text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            cart?.items?.map((item) => (
              <div key={item._id} className="flex gap-4 border border-gray-400 rounded-lg p-4">
                <img
                  src={item?.productId?.images[0].url}
                  alt={item?.productId?.name}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-400"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-sm md:text-md mb-1">{item?.productId?.name}</h3>
                  <p className=" text-sm md:text-md font-bold">Rs {item?.productId?.price.toLocaleString()}</p>
                  <input
                  type="text"
                  value={item?.fingerSize+" mm"}
                  step="0.5"
                  readOnly
                  className={`w-full pr-2 py-2 border-none outline-none rounded-lg text-[12px]`}
                />

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                        disabled={loading}
                        className="p-1 hover:bg-white rounded disabled:opacity-50"
                      >
                        <Minus size={14} className='cursor-pointer' />
                      </button>
                      <span className="w-8 text-center text-sm md:text-md font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                        disabled={loading}
                        className="p-1 hover:bg-white rounded disabled:opacity-50"
                      >
                        <Plus size={14} className='cursor-pointer' />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId._id)}
                      disabled={loading}
                      className="text-red-500 cursor-pointer hover:text-red-700 p-2 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
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
                <span>Rs {(total+charges).toLocaleString()}</span>
              </div>
            </div>

            <Link to="/checkout" onClick={closeCart}>
              <button className="w-full bg-black text-white py-4 rounded-lg font-semibold cursor-pointer hover:bg-gray-800">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}