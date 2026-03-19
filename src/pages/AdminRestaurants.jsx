import { useEffect, useState } from "react";
import API from "../services/api";

function AdminRestaurants() {
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/admin/allrestaurants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRestaurants(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRestaurant = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this restaurant?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/api/admin/deleterestaurant/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRestaurants((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  //  THEME
  const pageBg = isAdmin
    ? "bg-orange-50"
    : "bg-gradient-to-br from-black via-gray-900 to-indigo-900";

  const containerBg = isAdmin
    ? "bg-white text-gray-800"
    : "bg-white/10 text-white backdrop-blur border border-white/20";

  const headerBg = isAdmin
    ? "bg-orange-500 text-white"
    : "bg-indigo-600 text-white";

  const rowHover = isAdmin ? "hover:bg-orange-100" : "hover:bg-white/10";

  const textMuted = isAdmin ? "text-gray-500" : "text-gray-300";

  return (
    <div className={`min-h-screen p-4 md:p-8 ${pageBg}`}>
      <div
        className={`max-w-7xl mx-auto shadow-lg rounded-lg p-6 ${containerBg}`}
      >
        <h2
          className={`text-2xl md:text-3xl font-bold mb-6 text-center ${
            isAdmin ? "text-orange-600" : "text-white"
          }`}
        >
          🍽️ All Restaurants
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            {/* HEADER */}
            <thead>
              <tr className={headerBg}>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Restaurant</th>
                <th className="p-3 text-left">Owner</th>
                <th className="p-3 text-left">Details</th>
                <th className="p-3 text-left">Rating</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-6">
                    Loading...
                  </td>
                </tr>
              ) : restaurants.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6">
                    No Restaurants Found
                  </td>
                </tr>
              ) : (
                restaurants.map((r) => (
                  <tr key={r._id} className={`border-b transition ${rowHover}`}>
                    {/* IMAGE */}
                    <td className="p-3">
                      <img
                        src={
                          r.photos?.[0]
                            ? r.photos[0].startsWith("http")
                              ? r.photos[0]
                              : `https://restaurant-reservation-platform-backend.onrender.com/${r.photos[0]}`
                            : "https://source.unsplash.com/100x80/?food"
                        }
                        className="w-20 h-16 object-cover rounded"
                      />
                    </td>

                    {/* NAME */}
                    <td className="p-3 font-medium">{r.name}</td>

                    {/* OWNER */}
                    <td className="p-3">{r.owner?.name || "Unknown"}</td>

                    {/* DETAILS */}
                    <td className={`p-3 text-sm ${textMuted}`}>
                      <p>📍 {r.location?.city || "N/A"}</p>
                      <p>🍴 {r.cuisineTypes?.join(", ")}</p>
                    </td>

                    {/* RATING */}
                    <td
                      className={`p-3 font-semibold ${
                        isAdmin ? "text-orange-500" : "text-yellow-400"
                      }`}
                    >
                      ⭐ {r.averageRating || 0}
                    </td>

                    {/* DELETE */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => deleteRestaurant(r._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminRestaurants;
