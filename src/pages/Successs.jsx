import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-black to-green-800 px-4">
      
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-md w-full animate-fadeIn">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-500/20 p-4 rounded-full">
            <CheckCircle size={60} className="text-green-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-green-400 mb-3">
          Payment Successful 🎉
        </h1>

        {/* Message */}
        <p className="text-gray-300 text-sm md:text-base mb-6">
          Your payment has been processed successfully. 
          Thank you for your booking!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          
          <Link
            to="/"
            className="bg-green-500 hover:bg-green-600 transition px-6 py-2 rounded-xl text-white font-medium shadow-lg"
          >
            Go Home
          </Link>

          <Link
            to="/my-bookings"
            className="border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition px-6 py-2 rounded-xl font-medium"
          >
            View Bookings
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Success;