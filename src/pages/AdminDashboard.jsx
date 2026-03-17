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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await API.get("/api/admin/dashboardstatus", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setStats(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  return (

    <div className="min-h-screen bg-orange-50 p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold text-orange-600 mb-8 text-center">
          🍽️ Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Restaurants */}
          <div
            className="bg-orange-500 text-white p-6 rounded-lg cursor-pointer hover:bg-orange-600 transition transform hover:scale-105 shadow-md"
            onClick={() => navigate("/admin/restaurants")}
          >
            <h2 className="text-lg font-semibold">Restaurants</h2>
            <p className="text-3xl font-bold mt-3">{stats.restaurants}</p>
          </div>

          {/* Reviews */}
          <div
            className="bg-orange-400 text-white p-6 rounded-lg cursor-pointer hover:bg-orange-500 transition transform hover:scale-105 shadow-md"
            onClick={() => navigate("/admin/reviews")}
          >
            <h2 className="text-lg font-semibold">Reviews</h2>
            <p className="text-3xl font-bold mt-3">{stats.reviews}</p>
          </div>

          {/* Reservations */}
          <div
            className="bg-orange-600 text-white p-6 rounded-lg cursor-pointer hover:bg-orange-700 transition transform hover:scale-105 shadow-md"
            onClick={() => navigate("/admin/reservations")}
          >
            <h2 className="text-lg font-semibold">Reservations</h2>
            <p className="text-3xl font-bold mt-3">{stats.reservations}</p>
          </div>

          {/* Users */}
          <div
            className="bg-orange-700 text-white p-6 rounded-lg cursor-pointer hover:bg-orange-800 transition transform hover:scale-105 shadow-md"
            onClick={() => navigate("/admin/users")}
          >
            <h2 className="text-lg font-semibold">Users</h2>
            <p className="text-3xl font-bold mt-3">{stats.users}</p>
          </div>

        </div>

      </div>

    </div>

  );
}

export default AdminDashboard;