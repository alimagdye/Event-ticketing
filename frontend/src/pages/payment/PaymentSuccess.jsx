import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex justify-center items-center px-5">
      <div className="max-w-lg  w-full border border-gray-200 rounded-2xl shadow-xl text-center">
        
        {/* Header */}
        <div className="bg-linear-to-r from-primary to-secandry p-6 rounded-t-2xl">
          <CheckCircle className="mx-auto text-white w-16 h-16 mb-2" />
          <h1 className="text-3xl font-bold text-white">
            Payment Successful
          </h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            Your payment has been completed successfully 
          </p>

          <p className="text-sm text-gray-400">
            Your tickets have been booked and sent to your email.
          </p>
            <button 
            onClick={()=>{}}
            className="w-full bg-linear-to-r from-primary to-secandry text-white py-3 rounded-lg font-semibold mt-4 cursor-pointer hover:opacity-90 transition duration-300 " >
                Go To Your Tickets
            </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-white border border-primary text-primary py-3 rounded-lg font-semibold mt-4 cursor-pointer hover:bg-primary/10 transition duration-300 "
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
