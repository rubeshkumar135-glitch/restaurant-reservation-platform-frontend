import { Link } from "react-router-dom";
import { FaUtensils, FaStore } from "react-icons/fa";

function OwnerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 text-white px-6 py-10">
      {/* HEADER */}
      <div className="text-center mt-32 mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-400">
          Owner Dashboard
        </h1>
        <p className="text-gray-400 mt-3 text-sm md:text-base">
          Manage your restaurants and grow your business 🚀
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* CREATE RESTAURANT */}
        <Link
          to="/create-restaurant"
          className="group bg-white/10 backdrop-blur-lg border border-white/20 hover:border-indigo-400 
          p-8 rounded-2xl text-center shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex justify-center mb-4 text-indigo-400 text-4xl group-hover:rotate-6 transition">
            <FaUtensils />
          </div>

          <h2 className="text-xl font-semibold mb-2">Create Restaurant</h2>

          <p className="text-gray-400 text-sm">
            Add a new restaurant and start receiving bookings
          </p>
        </Link>

        {/* MY RESTAURANTS */}
        <Link
          to="/my-restaurants"
          className="group bg-white/10 backdrop-blur-lg border border-white/20 hover:border-indigo-400 
          p-8 rounded-2xl text-center shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex justify-center mb-4 text-indigo-400 text-4xl group-hover:rotate-6 transition">
            <FaStore />
          </div>

          <h2 className="text-xl font-semibold mb-2">My Restaurants</h2>

          <p className="text-gray-400 text-sm">
            View, edit, and manage your restaurant listings
          </p>
        </Link>
      </div>

      {/* FOOTER */}
      <div className="mt-16 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} FoodieHub
      </div>
    </div>
  );
}

export default OwnerDashboard;
