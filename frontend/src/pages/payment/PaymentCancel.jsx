import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex justify-center items-center px-5">
      <div className="max-w-lg w-full border border-gray-200 rounded-2xl shadow-xl text-center">
        
        {/* Header */}
        <div className="bg-linear-to-r from-secandry to-[#FF8370] p-6 rounded-t-2xl">
          <XCircle className="mx-auto text-white w-16 h-16 mb-2" />
          <h1 className="text-3xl font-bold text-white">
            Payment Cancelled
          </h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            Your payment was cancelled or failed ❌
          </p>

          <p className="text-sm text-gray-400">
            You can try again or return to the home page.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/payment/tickets")}
              className="w-full bg-linear-to-r from-primary to-secandry text-white py-3 rounded-lg font-semibold mt-4 cursor-pointer hover:opacity-90 transition duration-300 "
            >
              Try Again
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full border border-primary/80 py-3 rounded-lg font-semibold text-primary mt-4 cursor-pointer hover:bg-primary/10 transition duration-300 "
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancelPage;
