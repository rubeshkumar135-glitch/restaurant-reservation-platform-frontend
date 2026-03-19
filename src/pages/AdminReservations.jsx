import { useEffect, useState } from "react";
import API from "../services/api";

function AdminReservations() {
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/admin/allreservations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReservations(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
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
          📅 All Reservations
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            {/* HEADER */}
            <thead>
              <tr className={headerBg}>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Restaurant</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Party Size</th>
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
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6">
                    No Reservations Found
                  </td>
                </tr>
              ) : (
                reservations.map((r) => (
                  <tr key={r._id} className={`border-b transition ${rowHover}`}>
                    <td className="p-3">{r.user?.name || "N/A"}</td>

                    <td className={`p-3 ${textMuted}`}>
                      {r.user?.email || "N/A"}
                    </td>

                    <td className="p-3">{r.restaurant?.name || "N/A"}</td>

                    <td className={`p-3 ${textMuted}`}>{r.date}</td>

                    <td className="p-3">{r.time}</td>

                    <td className="p-3">{r.partySize}</td>
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

export default AdminReservations;
