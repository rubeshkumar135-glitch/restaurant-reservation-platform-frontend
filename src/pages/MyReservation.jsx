import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function MyReservations() {

  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get("/api/reservations/my", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReservations(res.data);

    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const cancelReservation = async (id) => {

    if (!window.confirm("Cancel this reservation?")) return;

    try {

      const token = localStorage.getItem("token");

      await API.delete(`/api/reservations/cancel/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchReservations();

    } catch (error) {
      console.log(error);
    }

  };

  return (

    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50 to-purple-100 px-4 md:px-10 py-10">

      <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        My Reservations
      </h1>

      {reservations.length === 0 ? (
        <p className="text-gray-500 text-center">
          No reservations found
        </p>
      ) : (

        <div className="max-w-3xl mx-auto space-y-6">

          {reservations.map((r) => (

            <div
              key={r._id}
              className="bg-white border border-gray-200 shadow-md rounded-xl p-6 hover:shadow-lg transition"
            >

              <h2 className="text-xl font-semibold text-indigo-600">
                {r.restaurant?.name}
              </h2>

              <div className="mt-2 text-gray-600 space-y-1">

                <p>
                  📅 Date: {new Date(r.date).toLocaleDateString()}
                </p>

                <p>
                  ⏰ Time: {r.time}
                </p>

                <p>
                  👥 Guests: {r.partySize}
                </p>

                <p>
                  Status: 
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      r.status === "booked"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </p>

              </div>

              <div className="flex flex-wrap gap-3 mt-4">

                {r.status === "booked" && (
                  <>
                    <Link
                      to={`/update-reservation/${r._id}`}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg transition"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => cancelReservation(r._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </>
                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default MyReservations;