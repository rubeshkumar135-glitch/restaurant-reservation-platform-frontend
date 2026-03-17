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
      setError("");

      const token = localStorage.getItem("token");

      const res = await API.get("/restaurants/owner", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRestaurants(res.data);

    } catch (error) {

      console.error(error);
      setError("Failed to load restaurants");

    } finally {
      setLoading(false);
    }

  };


  /* ---------------- DELETE ---------------- */

  const deleteRestaurant = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this restaurant?"
    );

    if (!confirmDelete) return;

    try {

      const token = localStorage.getItem("token");

      await API.delete(`/api/restaurants/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRestaurants(prev => prev.filter(r => r._id !== id));

      alert("Restaurant deleted successfully");

    } catch (error) {

      console.error(error);

      alert("Delete failed");

    }

  };


  /* ---------------- UI ---------------- */

  return (

    <div className="min-h-screen bg-black text-white px-6 md:px-10 py-14">

      <h1 className="text-4xl font-bold text-yellow-400 text-center mb-14">
        My Restaurants
      </h1>


      {/* Loading */}

      {loading && (
        <div className="text-center text-gray-400 text-lg">
          Loading restaurants...
        </div>
      )}


      {/* Error */}

      {error && (
        <div className="text-center text-red-400 mb-6">
          {error}
        </div>
      )}


      {/* Empty State */}

      {!loading && restaurants.length === 0 && (

        <div className="flex flex-col items-center justify-center mt-20">

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-10 text-center max-w-md">

            <h2 className="text-2xl font-semibold text-yellow-400 mb-3">
              No Restaurants Yet
            </h2>

            <p className="text-gray-400 mb-6">
              Start by creating your first restaurant.
            </p>

            <Link
              to="/create-restaurant"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-semibold transition"
            >
              Add Restaurant
            </Link>

          </div>

        </div>

      )}


      {/* Restaurant Grid */}

      {!loading && restaurants.length > 0 && (

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {restaurants.map((restaurant) => (

            <div
              key={restaurant._id}
              className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg hover:scale-105 hover:border-yellow-400 transition duration-300 overflow-hidden"
            >

              {/* Image */}

              {restaurant.photos?.length > 0 && (

                <img
                  src={restaurant.photos[0]}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />

              )}


              <div className="p-6">

                {/* Avatar */}

                <div className="w-12 h-12 flex items-center justify-center bg-yellow-500 text-black font-bold rounded-full text-lg mb-3">
                  {restaurant?.name?.charAt(0)}
                </div>


                {/* Name */}

                <h2 className="text-xl font-semibold mb-2">
                  {restaurant.name}
                </h2>


                {/* City */}

                <p className="text-gray-400 text-sm mb-5">
                  {restaurant.city}, {restaurant.state}
                </p>


                {/* Buttons */}

                <div className="flex gap-3">

                  <Link
                    to={`/update-restaurant/${restaurant._id}`}
                    className="flex-1 text-center bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg font-semibold transition"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteRestaurant(restaurant._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold transition"
                  >
                    Delete
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