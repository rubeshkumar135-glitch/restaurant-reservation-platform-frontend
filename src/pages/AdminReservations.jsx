import { useEffect, useState } from "react";
import API from "../services/api";

function AdminReservations() {

  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {

    const token = localStorage.getItem("token");

    const res = await API.get("/api/admin/allreservations", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setReservations(res.data);
  };

  return (

    <div className="min-h-screen bg-orange-50 p-4 md:p-8">

      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">

        <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-6 text-center">
          📅 All Reservations
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full border border-gray-200">

            <thead>

              <tr className="bg-orange-500 text-white">

                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Restaurant</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Party Size</th>

              </tr>

            </thead>

            <tbody>

              {reservations.length === 0 ? (

                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    No Reservations Found
                  </td>
                </tr>

              ) : (

                reservations.map((r) => (

                  <tr
                    key={r._id}
                    className="border-b hover:bg-orange-100 transition"
                  >

                    <td className="p-3">{r.user?.name}</td>
                    <td className="p-3">{r.user?.email}</td>
                    <td className="p-3">{r.restaurant?.name}</td>
                    <td className="p-3">{r.date}</td>
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