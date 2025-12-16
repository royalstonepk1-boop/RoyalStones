// pages/CheckoutCancel.jsx
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function CheckoutCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-10 h-10 text-yellow-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. Your cart items are still saved.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Return to Checkout
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
}