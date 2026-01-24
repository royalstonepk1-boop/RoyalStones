import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, MapPin, CreditCard, CheckCircle, Package, User } from 'lucide-react';
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
  const location = useLocation();
  const { cartWithProducts } = location?.state || {};
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { cart, openCart, fetchCart } = useCartStore();
  const { user, token } = useAuthStore();

  const { charges } = useDeliveryStore();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Guest user address state
  const [guestAddress, setGuestAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan'
  });
  const [addressErrors, setAddressErrors] = useState({});

  const cartDet = !user ? cartWithProducts : cart;

  // Calculate totals
  const subtotal = cartDet?.items.reduce(
    (sum, item) => sum + (item.productId.discountPrice ? item.productId.discountPrice : item.productId.price) * item.carretValue * item.quantity,
    0
  ) || 0;
  const total = subtotal + charges;

  useEffect(() => {
    // Fetch cart for authenticated users
    if (user && token) {
      fetchCart();
    }
  }, []);

  const handleAddressSelection = (addressId) => {
    setSelectedAddress(addressId);
    setErrorMsg('');
  };

  const handleGuestAddressChange = (e) => {
    const { name, value } = e.target;
    setGuestAddress(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (addressErrors[name]) {
      setAddressErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateGuestAddress = () => {
    const errors = {};
    
    if (!guestAddress.fullName.trim()) errors.fullName = 'Full name is required';
    if (!guestAddress.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(guestAddress.email)) {
      errors.email = 'Invalid email format';
    }
    if (!guestAddress.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(guestAddress.phone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Invalid phone number';
    }
    if (!guestAddress.address.trim()) errors.address = 'Address is required';
    if (!guestAddress.city.trim()) errors.city = 'City is required';
    if (!guestAddress.state.trim()) errors.state = 'State/Province is required';
    if (!guestAddress.postalCode.trim()) errors.postalCode = 'Postal code is required';

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const proceedToPayment = () => {
    if (!user) {
      // Guest user - validate address form
      if (!validateGuestAddress()) {
        setErrorMsg('Please fill in all required fields correctly');
        return;
      }
    } else {
      // Authenticated user - check if address is selected
      if (!selectedAddress) {
        setErrorMsg('Please select a delivery address');
        return;
      }
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
        // Prepare order data
        const orderData = {
          billingAddress: user ? user.addresses.find(a => a._id === selectedAddress) : guestAddress,
          shippingAddress: user ? user.addresses.find(a => a._id === selectedAddress) : guestAddress,
          paymentMethod: 'cod',
          deliveryCharges: charges,
          cart: cartDet,
          user: user,
        };

        const response = await createOrderApi(orderData);
        
        if (response) {
          if (user) {
            fetchCart();
          }
          else{
            localStorage.removeItem('guest_cart');
          }
        }

        const order = response.data;
        const adminPhone = '923155066472';

        const customerName = user ? user.name : guestAddress.fullName;
        const customerEmail = user ? user.email : guestAddress.email;
        const shippingAddr = orderData.shippingAddress;

        const message = `
🛒 *New Order Received!*

📦 *Order #RSSJ${order.orderNumber}*
💰 *Total Amount:* Rs ${order.totalAmount.toLocaleString()}
📍 *Payment:* Cash on Delivery

👤 *Customer Details:*
Name: ${customerName}
Email: ${customerEmail}
${!user ? '(Guest Order)' : ''}

📬 *Shipping Address:*
${shippingAddr.fullName}
${shippingAddr.address}
${shippingAddr.city}, ${shippingAddr.state}
${shippingAddr.postalCode}
Phone: ${shippingAddr.phone}

🛍️ *Order Items:*
${cartDet.items.map((item, i) =>
          `${i + 1}. ${item.productId.name}
   Qty: ${item.quantity} × Rs ${(item.productId.discountPrice * item.carretValue || item.productId.price * item.carretValue).toLocaleString()} ${item.carretValue ? `(${item.carretValue} Carat)` : ''}`
        ).join('\n')}

📊 *Order Summary:*
Subtotal: Rs ${(order.totalAmount - order.deliveryCharges).toLocaleString()}
Delivery: Rs ${order.deliveryCharges.toLocaleString()}
Total: Rs ${order.totalAmount.toLocaleString()}
    `.trim();

        const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success('Order placed successfully!');
        user ? navigate('/orders') : navigate('/')
      } else if (paymentMethod === 'full_advance') {
        const orderData = {
          billingAddress: user ? user.addresses.find(a => a._id === selectedAddress) : guestAddress,
          shippingAddress: user ? user.addresses.find(a => a._id === selectedAddress) : guestAddress,
          paymentMethod: 'full_advance',
          deliveryCharges: charges,
          cart: cartDet,
          user: user,
        };

        const response = await createOrderApi(orderData);
        
        if (response) {
          if (user) {
            fetchCart();
          }
          else{
            localStorage.removeItem('guest_cart');
          }
        }

        const order = response.data;
        const adminPhone = '923155066472';

        const customerName = user ? user.name : guestAddress.fullName;
        const customerEmail = user ? user.email : guestAddress.email;
        const shippingAddr = orderData.shippingAddress;

        const message = `
🛒 *New Order Received!*

📦 *Order #RSSJ${order.orderNumber}*
💰 *Total Amount:* Rs ${order.totalAmount.toLocaleString()}
📍 *Payment:* Full Advance Payment

👤 *Customer Details:*
Name: ${customerName}
Email: ${customerEmail}
${!user ? '(Guest Order)' : ''}

📬 *Shipping Address:*
${shippingAddr.fullName}
${shippingAddr.address}
${shippingAddr.city}, ${shippingAddr.state}
${shippingAddr.postalCode}
Phone: ${shippingAddr.phone}

🛍️ *Order Items:*
${cartDet.items.map((item, i) =>
          `${i + 1}. ${item.productId.name}
   Qty: ${item.quantity} × Rs ${(item.productId.discountPrice * item.carretValue || item.productId.price * item.carretValue).toLocaleString()} ${item.carretValue ? `(${item.carretValue} Carat)` : ''}`
        ).join('\n')}

📊 *Order Summary:*
Subtotal: Rs ${(order.totalAmount - order.deliveryCharges).toLocaleString()}
Delivery: Rs ${order.deliveryCharges.toLocaleString()}
Total: Rs ${order.totalAmount.toLocaleString()}
    `.trim();

        const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success('Order placed successfully!');
        user ? navigate('/orders') : navigate('/')
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
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          {step > 1 ? <CheckCircle size={20} /> : <ShoppingCart size={20} />}
        </div>
        <div className={`w-24 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />

        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          {step > 2 ? <CheckCircle size={20} /> : <MapPin size={20} />}
        </div>
        <div className={`w-24 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />

        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          <CreditCard size={20} />
        </div>
      </div>
    </div>
  );

  const CartReview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Review Your Order</h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {cartDet?.items?.map((item) => (
          <div key={item._id} className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0">
            <img
              src={item.productId.images[0].url}
              alt={item.productId.name}
              className="w-20 h-20 object-cover rounded border border-gray-300"
            />
            <div className="flex-1 w-[60%]">
              <h3 className="font-semibold break-words text-gray-800">
                {item?.productId?.name?.length > 50 ? item?.productId?.name?.slice(0, 50) + '...' : item?.productId?.name}
              </h3>
              <div className="text-sm text-gray-600 mt-1">
                <p>Quantity: {item.quantity}</p>
                {item.carretValue && <p>Carat: {item.carretValue} Carat</p>}
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

  // Guest Address Form Component
  const GuestAddressForm = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Enter Delivery Details</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Guest Checkout:</strong> You're checking out as a guest. Your information will only be used for this order.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={guestAddress.fullName}
            onChange={handleGuestAddressChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              addressErrors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
          />
          {addressErrors.fullName && (
            <p className="text-red-500 text-xs mt-1">{addressErrors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={guestAddress.email}
            onChange={handleGuestAddressChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              addressErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
          />
          {addressErrors.email && (
            <p className="text-red-500 text-xs mt-1">{addressErrors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={guestAddress.phone}
            onChange={handleGuestAddressChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              addressErrors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="03001234567"
          />
          {addressErrors.phone && (
            <p className="text-red-500 text-xs mt-1">{addressErrors.phone}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={guestAddress.address}
            onChange={handleGuestAddressChange}
            rows="2"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              addressErrors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="House #, Street, Area"
          />
          {addressErrors.address && (
            <p className="text-red-500 text-xs mt-1">{addressErrors.address}</p>
          )}
        </div>

        {/* City and State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={guestAddress.city}
              onChange={handleGuestAddressChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                addressErrors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Rawalpindi"
            />
            {addressErrors.city && (
              <p className="text-red-500 text-xs mt-1">{addressErrors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State/Province <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={guestAddress.state}
              onChange={handleGuestAddressChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                addressErrors.state ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Punjab"
            />
            {addressErrors.state && (
              <p className="text-red-500 text-xs mt-1">{addressErrors.state}</p>
            )}
          </div>
        </div>

        {/* Postal Code and Country */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="postalCode"
              value={guestAddress.postalCode}
              onChange={handleGuestAddressChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                addressErrors.postalCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="46000"
            />
            {addressErrors.postalCode && (
              <p className="text-red-500 text-xs mt-1">{addressErrors.postalCode}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={guestAddress.country}
              onChange={handleGuestAddressChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errorMsg}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => { setErrorMsg(''); setAddressErrors({}); setStep(1); }}
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
    </div>
  );

  // Address Selection for authenticated users
  const AddressSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Select Delivery Address</h2>

      {user?.addresses?.length === 0 ? (
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
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedAddress === address._id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAddress === address._id
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
            {selectedAddress === null && errorMsg && (
              <div className='flex justify-start items-center text-red-500'>{errorMsg}</div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setErrorMsg(''); setStep(1); }}
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

  const PaymentMethod = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Select Payment Method</h2>

      <div className="space-y-4">
        <div
          onClick={() => setPaymentMethod('cod')}
          className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
            paymentMethod === 'cod'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === 'cod'
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
          {paymentMethod === 'cod' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
              Note: 10% of the total amount will be collected as an advance payment for Cash on Delivery orders.
            </div>
          )}
        </div>

        <div
        onClick={() => setPaymentMethod('full_advance')}
          className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
            paymentMethod === 'full_advance'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === 'full_advance'
                ? 'border-blue-600 bg-blue-600'
                : 'border-gray-300'
            }`}>
              {paymentMethod === 'full_advance' && (
                <div className="w-3 h-3 bg-white rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Full Advance Payment</h3>
              <p className="text-sm text-gray-600 mt-1">Orders processed after full payment</p>
            </div>
            <CreditCard size={32} className="text-gray-400" />
            
          </div>
          {paymentMethod === 'full_advance' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
              Note: The total amount must be paid in full before order processing.
            </div>
          )}
        </div>
        
        {paymentMethod === '' && errorMsg && (
          <div className='flex justify-start items-center text-red-500'>{errorMsg}</div>
        )}
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
          onClick={() => { setErrorMsg(''); setStep(2); }}
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

        {step === 1 && <PageWrapper><CartReview /></PageWrapper>}
        {step === 2 && (
          <PageWrapper>
            {user ? <AddressSelection /> : <GuestAddressForm />}
          </PageWrapper>
        )}
        {step === 3 && <PageWrapper><PaymentMethod /></PageWrapper>}
      </div>
    </div>
  );
}