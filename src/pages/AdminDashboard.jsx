import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const [stats, setStats] = useState({
    restaurants: 0,
    reviews: 0,
    reservations: 0,
    users: 0,
  });

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const statsRes = await API.get("/api/admin/dashboardstatus", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await API.get("/api/admin/allrestaurants", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(statsRes.data);
      setRestaurants(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //  STAT CARD
  const StatCard = ({ title, value }) => (
    <div
      className={`p-5 rounded-xl shadow transition ${
        isAdmin
          ? "bg-orange-500 text-white hover:bg-orange-600"
          : "bg-indigo-500 text-white hover:bg-indigo-600"
      }`}
    >
      <h3 className="text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );

  //  PAGE STYLE
  const pageBg = isAdmin
    ? "bg-orange-50"
    : "bg-gradient-to-br from-black via-gray-900 to-indigo-900";

  const containerBg = isAdmin
    ? "bg-white text-gray-800"
    : "bg-white/10 text-white backdrop-blur-xl border border-white/20";

  const titleColor = isAdmin ? "text-orange-600" : "text-white";

  const cardBg = isAdmin
    ? "bg-white border shadow"
    : "bg-white/10 border border-white/20 backdrop-blur";

  return (
    <div className={`min-h-screen md:p-8 ${pageBg}`}>
      <div className={`max-w-7xl mx-auto rounded-lg mt-32 p-6 ${containerBg}`}>
        {/* TITLE */}
        <h1
          className={`text-3xl md:text-4xl font-bold text-center mb-8 mt-10 ${titleColor}`}
        >
          🍽️ Admin Dashboard
        </h1>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard title="Restaurants" value={stats.restaurants} />
          <StatCard title="Users" value={stats.users} />
          <StatCard title="Reviews" value={stats.reviews} />
          <StatCard title="Reservations" value={stats.reservations} />
        </div>

        {/* RESTAURANTS */}
        <div>
          <h2 className={`text-2xl font-bold mb-6 ${titleColor}`}>
            🍽 Restaurants Overview
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r) => (
              <div
                key={r._id}
                className={`rounded-lg p-4 transition hover:shadow-xl ${cardBg}`}
              >
                {/* IMAGE */}
                <img
                  src={
                    r.photos?.[0]
                      ? r.photos[0].startsWith("http")
                        ? r.photos[0]
                        : `https://restaurant-reservation-platform-backend.onrender.com/${r.photos[0]}`
                      : "https://source.unsplash.com/400x300/?restaurant"
                  }
                  className="w-full h-40 object-cover rounded-md mb-3"
                  onError={(e) => {
                    e.target.src = "https://source.unsplash.com/400x300/?food";
                  }}
                />

                {/* NAME */}
                <h3 className="text-lg font-bold">{r.name}</h3>

                {/* LOCATION */}
                <p
                  className={`${isAdmin ? "text-gray-500" : "text-gray-300"} text-sm`}
                >
                  📍 {r.location?.city || "Unknown"}
                </p>

                {/* CUISINE */}
                <p
                  className={`${isAdmin ? "text-gray-400" : "text-gray-400"} text-sm`}
                >
                  🍴 {r.cuisineTypes?.join(", ")}
                </p>

                {/* OWNER */}
                <div
                  className={`mt-2 text-sm ${isAdmin ? "text-gray-500" : "text-gray-300"}`}
                >
                  <p>👤 {r.owner?.name || "N/A"}</p>
                  <p>📧 {r.owner?.email || "N/A"}</p>
                </div>

                {/* RATING */}
                <p
                  className={`mt-2 font-semibold ${isAdmin ? "text-orange-500" : "text-yellow-400"}`}
                >
                  ⭐ {r.averageRating || 0} ({r.totalReviews || 0})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
