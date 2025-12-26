import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, MapPin, CreditCard, CheckCircle, Package } from 'lucide-react';
import { useDeliveryStore } from '../store/deliveryStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import PageWrapper from '../util/PageWrapper';
import { createOrderApi } from '../api/order.api';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import BACKEND_URL from '../api/backend';

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { cart, openCart, fetchCart } = useCartStore();
  const { user ,token } = useAuthStore();

  const { charges } = useDeliveryStore();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  // Calculate totals
  const subtotal = cart?.items.reduce(
    (sum, item) => sum + (item.productId.discountPrice ? item.productId.discountPrice : item.productId.price) * item.carretValue * item.quantity,
    0
  ) || 0;
  const total = subtotal + charges;

  useEffect(() => {
    // Fetch cart, user addresses, and delivery charges
    // fetchCart();
    // fetchUserAddresses();
    // fetchDeliveryCharges();
  }, []);

  const handleAddressSelection = (addressId) => {
    setSelectedAddress(addressId);
  };

  const proceedToPayment = () => {
    if (!selectedAddress) {
      setErrorMsg('Please select a delivery address');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      setErrorMsg('Please select a payment method');
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'cod') {
        // Create order with COD
        const orderData = {
          billingAddress: user.addresses.find(a => a._id === selectedAddress),
          shippingAddress: user.addresses.find(a => a._id === selectedAddress),
          paymentMethod: 'cod',
          deliveryCharges: charges,
        };

        const response = await createOrderApi(orderData);
        // console.log(response.data);
        // Simulate API call
        if (response) {
          fetchCart();
        }
        const order = response.data;
        const adminPhone = '923155066472'; // Replace with your admin's phone (country code + number, no + or -)

        const message = `
🛒 *New Order Received!*

📦 *Order #RSSJ${order.orderNumber}*
💰 *Total Amount:* Rs ${order.totalAmount.toLocaleString()}
📍 *Payment:* Cash on Delivery

👤 *Customer Details:*
Name: ${user.name}
Email: ${user.email}

📬 *Shipping Address:*
${orderData.shippingAddress.fullName}
${orderData.shippingAddress.address}
${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}
${orderData.shippingAddress.postalCode}
Phone: ${orderData.shippingAddress.phone}

🛍️ *Order Items:*
${cart.items.map((item, i) =>
          `${i + 1}. ${item.productId.name}
   Qty: ${item.quantity} × Rs ${(item.productId.discountPrice || item.productId.price).toLocaleString()}`
        ).join('\n')}

📊 *Order Summary:*
Subtotal: Rs ${(order.totalAmount - order.deliveryCharges).toLocaleString()}
Delivery: Rs ${order.deliveryCharges.toLocaleString()}
Total: Rs ${order.totalAmount.toLocaleString()}
    `.trim();

        // Open WhatsApp
        const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        await new Promise(resolve => setTimeout(resolve, 1000));

        navigate('/orders');
      } else if (paymentMethod === 'card') {
        // Redirect to Stripe
        const body = {
          products: cart.items,
          deliveryCharges: charges
        };
        
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
  
        const response = await fetch(
          `${BACKEND_URL}/orders/create-checkout-session`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
          }
        );
  
        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }
  
        const session = await response.json();
  
        // Create order record before redirecting
        const orderData = {
          billingAddress: user.addresses.find(a => a._id === selectedAddress),
          shippingAddress: user.addresses.find(a => a._id === selectedAddress),
          paymentMethod: 'card',
          deliveryCharges: charges,
        };
  
        await createOrderApi(orderData);
  
        // Redirect to Lemon Squeezy checkout
        window.location.href = session.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
          {step > 1 ? <CheckCircle size={20} /> : <ShoppingCart size={20} />}
        </div>
        <div className={`w-24 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />

        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
          {step > 2 ? <CheckCircle size={20} /> : <MapPin size={20} />}
        </div>
        <div className={`w-24 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />

        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
          <CreditCard size={20} />
        </div>
      </div>
    </div>
  );

  // Step 1: Cart Review
  const CartReview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Review Your Order</h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {cart?.items?.map((item) => (
          <div key={item._id} className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0">
            <img
              src={item.productId.images[0].url}
              alt={item.productId.name}
              className="w-20 h-20 object-cover rounded border border-gray-300"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.productId.name}</h3>
              <div className="text-sm text-gray-600 mt-1">
                <p>Quantity: {item.quantity}</p>
                {item.carretValue && <p>Carret: {item.carretValue}Carret</p>}
                {item.fingerSize && <p>Finger Size: {item.fingerSize}mm</p>}
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">
                Rs {((item.productId.discountPrice ? item.productId.discountPrice : item.productId.price) * item.quantity * item.carretValue).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Rs {((item.productId.discountPrice ? item.productId.discountPrice : item.productId.price) * item.carretValue).toLocaleString()} each
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>Rs {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-orange-600">
            <span>Delivery Charges</span>
            <span>Rs {charges.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-300 pt-3 flex justify-between text-xl font-bold text-gray-800">
            <span>Total</span>
            <span>Rs {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className='flex gap-3'>
        <button
          onClick={() => { navigate('/shop'); openCart(); }}
          className="w-full bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Back to Cart
        </button>
        <button
          onClick={() => setStep(2)}
          className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Continue to Address
        </button>
      </div>

    </div>
  );

  // Step 2: Address Selection
  const AddressSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Select Delivery Address</h2>

      {user.addresses.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Package size={48} className="mx-auto text-yellow-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Address Found</h3>
          <p className="text-gray-600 mb-4">Please add a delivery address to continue</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Add Address
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {user.addresses.map((address) => (
              <div
                key={address._id}
                onClick={() => handleAddressSelection(address._id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedAddress === address._id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddress === address._id
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                    }`}>
                    {selectedAddress === address._id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{address.fullName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {address.address}, {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                  </div>
                </div>
              </div>
            ))}
            {
              selectedAddress === null && <div className='flex justify-start items-center text-red-500'>{errorMsg}</div>
            }
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setErrorMsg(''); setStep(1) }}
              className="flex-1 bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={proceedToPayment}
              className="flex-1 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );

  // Step 3: Payment Method
  const PaymentMethod = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Select Payment Method</h2>

      <div className="space-y-4">
        <div
          onClick={() => setPaymentMethod('cod')}
          className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${paymentMethod === 'cod'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod'
                ? 'border-blue-600 bg-blue-600'
                : 'border-gray-300'
              }`}>
              {paymentMethod === 'cod' && (
                <div className="w-3 h-3 bg-white rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Cash on Delivery</h3>
              <p className="text-sm text-gray-600 mt-1">Pay when you receive your order</p>
            </div>
            <Package size={32} className="text-gray-400" />
          </div>
          {
            paymentMethod === 'cod' &&
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
              Note: 10% of the total amount will be collected as an advance payment for Cash on Delivery orders.
            </div>
          }
        </div>

        <div
          onClick={() => setPaymentMethod('card')}
          className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${paymentMethod === 'card'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card'
                ? 'border-blue-600 bg-blue-600'
                : 'border-gray-300'
              }`}>
              {paymentMethod === 'card' && (
                <div className="w-3 h-3 bg-white rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Card Payment (Stripe)</h3>
              <p className="text-sm text-gray-600 mt-1">Pay securely with your credit/debit card</p>
            </div>
            <CreditCard size={32} className="text-gray-400" />
          </div>
        </div>
        {
          paymentMethod === '' && <div className='flex justify-start items-center text-red-500'>{errorMsg}</div>
        }

      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>Rs {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery</span>
            <span>Rs {charges.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold text-gray-800">
            <span>Total</span>
            <span>Rs {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => { setErrorMsg(''); setStep(2) }}
          className="flex-1 bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="flex-1 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Complete Order'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <StepIndicator />

        {step === 1 && <PageWrapper> <CartReview /> </PageWrapper>}
        {step === 2 && <PageWrapper> <AddressSelection /> </PageWrapper>}
        {step === 3 && <PageWrapper> <PaymentMethod /> </PageWrapper>}
      </div>
    </div>
  );
}