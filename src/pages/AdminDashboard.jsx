import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    restaurants: 0,
    reviews: 0,
    reservations: 0,
    users: 0
  });

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // 🔥 stats
      const statsRes = await API.get("/api/admin/dashboardstatus", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(statsRes.data);

      // 🔥 restaurants (FULL DATA)
      const res = await API.get("/api/admin/allrestaurants", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRestaurants(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const Card = ({ title, value, color, onClick }) => (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl text-white cursor-pointer hover:scale-105 transition ${color}`}
    >
      <h2 className="text-lg">{title}</h2>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  );

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 p-4 md:p-8 text-white">

      <div className="max-w-7xl mx-auto">

        {/* 🔥 TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          🍽️ Admin Dashboard
        </h1>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <Card
            title="Restaurants"
            value={stats.restaurants}
            color="bg-orange-500"
            onClick={() => navigate("/admin/restaurants")}
          />

          <Card
            title="Reviews"
            value={stats.reviews}
            color="bg-yellow-500"
            onClick={() => navigate("/admin/reviews")}
          />

          <Card
            title="Reservations"
            value={stats.reservations}
            color="bg-red-500"
            onClick={() => navigate("/admin/reservations")}
          />

          <Card
            title="Users"
            value={stats.users}
            color="bg-indigo-500"
            onClick={() => navigate("/admin/users")}
          />

        </div>

        {/* 🔥 RESTAURANTS PREVIEW */}
        <div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              🍽 Restaurants Overview
            </h2>

            <button
              onClick={() => navigate("/admin/restaurants")}
              className="bg-indigo-500 px-4 py-1 rounded"
            >
              View All
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {restaurants.slice(0, 6).map((r) => (

              <div
                key={r._id}
                className="bg-white/10 backdrop-blur-xl p-4 rounded-xl shadow-lg hover:scale-105 transition"
              >

                {/* 🖼 IMAGE */}
                <img
                  src={
                    r.photos?.[0]
                      ? `https://restaurant-reservation-platform-backend.onrender.com/${r.photos[0]}`
                      : "https://source.unsplash.com/400x300/?food"
                  }
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />

                {/* 🏪 NAME */}
                <h3 className="text-lg font-bold">{r.name}</h3>

                {/* 📍 LOCATION */}
                <p className="text-sm text-gray-300">
                  📍 {r.location?.city}
                </p>

                {/* 🍴 CUISINE */}
                <p className="text-sm text-gray-400">
                  🍴 {r.cuisineTypes?.join(", ")}
                </p>

                {/* 👤 OWNER */}
                <div className="mt-2 text-xs text-gray-400">
                  <p>👤 {r.owner?.name}</p>
                  <p>📧 {r.owner?.email}</p>
                  <p>📞 {r.owner?.phone}</p>
                </div>

                {/* ⭐ RATING */}
                <p className="mt-2 text-yellow-400 text-sm">
                  ⭐ {r.averageRating || 0} ({r.totalReviews || 0})
                </p>

                {/* 💬 REVIEWS */}
                <div className="mt-2 space-y-1">
                  {r.reviews?.length > 0 ? (
                    r.reviews.map((rev) => (
                      <p key={rev._id} className="text-xs text-gray-300">
                        💬 {rev.user?.name}: {rev.comment}
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No reviews</p>
                  )}
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;