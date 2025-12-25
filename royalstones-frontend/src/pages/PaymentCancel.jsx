import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center mt-[-100px] bg-red-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <XCircle className="mx-auto text-red-500 w-20 h-20 mb-4" />

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No amount has been charged.
        </p>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-red-600 hover:bg-red-700 cursor-pointer text-white py-3 rounded-lg font-medium transition"
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
}
