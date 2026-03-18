import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaUsers, FaStar, FaCalendarCheck } from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    restaurants: 0,
    reviews: 0,
    reservations: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await API.get("/api/admin/dashboardstatus", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data || {});
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Card reusable component
  const Card = ({ title, value, icon, color, onClick }) => (
    <div
      onClick={onClick}
      className={`bg-gradient-to-r ${color} text-white p-6 rounded-xl cursor-pointer 
      transform hover:scale-105 transition duration-300 shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold mt-4">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold text-orange-600 mb-8 text-center">
          🍽️ Admin Dashboard
        </h1>

        {/* Loading */}
        {loading && (
          <p className="text-center text-orange-600 text-lg">Loading...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 text-lg">{error}</p>
        )}

        {/* Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <Card
              title="Restaurants"
              value={stats.restaurants}
              icon={<FaUtensils />}
              color="from-orange-400 to-orange-600"
              onClick={() => navigate("/admin/restaurants")}
            />

            <Card
              title="Reviews"
              value={stats.reviews}
              icon={<FaStar />}
              color="from-yellow-400 to-orange-500"
              onClick={() => navigate("/admin/reviews")}
            />

            <Card
              title="Reservations"
              value={stats.reservations}
              icon={<FaCalendarCheck />}
              color="from-orange-500 to-red-500"
              onClick={() => navigate("/admin/reservations")}
            />

            <Card
              title="Users"
              value={stats.users}
              icon={<FaUsers />}
              color="from-orange-600 to-red-600"
              onClick={() => navigate("/admin/users")}
            />

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;