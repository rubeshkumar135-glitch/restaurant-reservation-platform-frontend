import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function UserDashboard() {

  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {

      const res = await API.get("/api/restaurants");
      setRestaurants(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSearch = async (value) => {

    setSearch(value);

    if (value === "") {
      fetchRestaurants();
      return;
    }

    try {

      const res = await API.get(`/api/restaurants/search?query=${value}`);
      setRestaurants(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50 to-purple-100 px-4 md:px-12 py-12">

      {/* Title */}

      <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-12 text-center">
        🍽 Explore Restaurants
      </h1>

      {/* Search */}

      <div className="flex justify-center mb-12">

        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full md:w-1/2 p-4 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />

      </div>

      {/* Loading */}

      {loading ? (

        <div className="text-center text-indigo-600 text-lg font-semibold">
          Loading restaurants...
        </div>

      ) : restaurants.length === 0 ? (

        /* No Restaurants UI */

        <div className="flex flex-col items-center justify-center mt-20 text-center">

          <div className="bg-white shadow-md rounded-2xl p-10 max-w-md">

            <h2 className="text-2xl font-semibold text-indigo-600 mb-3">
              No Restaurants Available
            </h2>

            <p className="text-gray-500 mb-4">
              We couldn't find any restaurants at the moment.
            </p>

            <button
              onClick={fetchRestaurants}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition"
            >
              Refresh
            </button>

          </div>

        </div>

      ) : (

        /* Restaurant Grid */

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {restaurants.map((restaurant) => (

            <div
              key={restaurant._id}
              className="bg-white/70 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1 overflow-hidden"
            >

              {/* Image */}

              {restaurant.photos?.length > 0 && (

                <img
                    src={
                        restaurant.photos && restaurant.photos.length > 0
                        ? restaurant.photos[0] // Use the Cloudinary URL directly
                        : "https://via.placeholder.com/400x300?text=No+Image" // Fallback if no photo
                    }
                    alt={restaurant.name || "restaurant"}
                    className="w-full h-80 object-cover"
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=Error+Loading+Image";
                    }}
                />

              )}

              <div className="p-5">

                <h2 className="text-xl font-semibold text-indigo-700 mb-1">
                  {restaurant.name}
                </h2>

                <p className="text-gray-600 text-sm mb-2">
                 Description : {restaurant.description}
                </p>

                <p className="text-gray-600 text-sm mb-2">
                 Cuisine: {restaurant.cuisineTypes}
                </p>

                <p className="text-gray-600 text-sm mb-2">
                 PriceRange: {restaurant.priceRange}
                </p>
                
                <p className="text-gray-500 text-sm mb-4">
                  📍 {restaurant?.location?.city}, {restaurant?.location?.state}
                </p>

                {/* Buttons */}

                <div className="flex flex-wrap gap-2">

                  <Link
                    to={`/reviews/${restaurant._id}`}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    Reviews
                  </Link>

                  <Link
                    to={`/create-review/${restaurant._id}`}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    Write Review
                  </Link>

                  <Link
                    to={`/create-reservation/${restaurant._id}`}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    Reserve
                  </Link>

                  <Link
                    to="/my-reservations"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    My Reservations
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default UserDashboard;