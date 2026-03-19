import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function MyRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await API.get("/api/restaurants/owner", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRestaurants(res.data);
    } catch {
      setError("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const deleteRestaurant = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/api/restaurants/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRestaurants((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 text-white px-6 py-20">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-indigo-400">
          My Restaurants
        </h1>
        <p className="text-gray-400 mt-2">Manage your food empire 🍽️</p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-white/10 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      )}

      {/* ERROR */}
      {error && <p className="text-center text-red-400">{error}</p>}

      {/* EMPTY */}
      {!loading && restaurants.length === 0 && (
        <div className="flex justify-center mt-20">
          <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl border border-white/20 text-center">
            <h2 className="text-2xl text-indigo-400 mb-3">No Restaurants</h2>
            <p className="text-gray-400 mb-6">Start building now 🚀</p>
            <Link
              to="/create-restaurant"
              className="bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded-lg text-white font-semibold"
            >
              Create Restaurant
            </Link>
          </div>
        </div>
      )}

      {/* GRID */}
      {!loading && restaurants.length > 0 && (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="group relative rounded-2xl overflow-hidden bg-white/10 border border-white/20 backdrop-blur-xl hover:border-indigo-400 transition"
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={
                    restaurant.photos?.[0] || "https://via.placeholder.com/400"
                  }
                  className="w-full object-cover group-hover:scale-110 transition duration-500"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                {/* TITLE */}
                <div className="absolute bottom-3 left-4">
                  <h2 className="text-lg font-bold">{restaurant.name}</h2>
                  <p className="text-xs text-gray-300 pt-1">
                    {restaurant.location?.city}, {restaurant.location?.state}
                  </p>
                </div>
              </div>

              {/* BODY */}
              <div className="p-5">
                {/* CUISINE */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.cuisineTypes?.map((c, i) => (
                    <span
                      key={i}
                      className="text-sm bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  {/* REVIEWS */}
                  <Link
                    to="/my-reviews"
                    className="flex-1 text-center bg-indigo-500 hover:bg-indigo-600 py-2 rounded-lg text-sm font-semibold"
                  >
                    💬 Reviews
                  </Link>

                  {/* EDIT */}
                  <Link
                    to={`/update-restaurant/${restaurant._id}`}
                    className="flex-1 text-center bg-white/20 py-2 rounded-lg font-semibold hover:bg-white/30 transition"
                  >
                    ✏️ Edit
                  </Link>

                  {/* DELETE */}
                  <button
                    onClick={() => deleteRestaurant(restaurant._id)}
                    className="flex-1 bg-red-500 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRestaurants;
