import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center mt-[-100px] bg-green-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <CheckCircle className="mx-auto text-green-500 w-20 h-20 mb-4" />

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you! Your payment has been processed successfully.
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white py-3 rounded-lg font-medium transition"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
}
