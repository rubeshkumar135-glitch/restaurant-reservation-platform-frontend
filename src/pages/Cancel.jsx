import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

function Cancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-black to-red-800 px-4">
      
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-md w-full animate-fadeIn">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/20 p-4 rounded-full">
            <XCircle size={60} className="text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-red-400 mb-3">
          Payment Cancelled ❌
        </h1>

        {/* Message */}
        <p className="text-gray-300 text-sm md:text-base mb-6">
          Your payment was not completed. You can try again or return to home.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          
          <Link
            to="/"
            className="bg-red-500 hover:bg-red-600 transition px-6 py-2 rounded-xl text-white font-medium shadow-lg"
          >
            Go Home
          </Link>

          <Link
            to="/restaurants"
            className="border border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition px-6 py-2 rounded-xl font-medium"
          >
            Try Again
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Cancel;