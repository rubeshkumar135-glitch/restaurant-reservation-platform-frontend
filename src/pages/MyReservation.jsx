import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function MyReservations() {

  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/reservations/my", {
        headers: { Authorization: `Bearer ${token}` }
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
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchReservations();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-indigo-900 px-4 md:px- py-20 text-white">

      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-center mb-12 tracking-wide">
        ✨ My Reservations
      </h1>

      {reservations.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-400 text-lg mb-4">
            No reservations yet 😔
          </p>
          <Link
            to="/"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 hover:scale-105 transition transform shadow-lg"
          >
            Explore Restaurants
          </Link>
        </div>
      ) : (

        <div className="max-w-5xl mx-auto grid gap-8">

          {reservations.map((r) => (

            <div
              key={r._id}
              className="relative group rounded-2xl p-[2px] bg-gradient-to-r from-pink-500 via-indigo-500 to-purple-500 hover:scale-[1.02] transition duration-300"
            >

              {/* Glass Card */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6">

                {/* Image */}
                <img
src={
  r.restaurant?.photos?.[0]
    ? r.restaurant.photos[0] // 🔥 DIRECT USE
    : "https://source.unsplash.com/400x300/?food"
}
                  alt="restaurant"
                  className="w-full md:w-52 h-40 object-cover rounded-xl shadow-lg"
                />

                {/* Content */}
                <div className="flex-1">

                  <div className="flex justify-between items-center">

                    <h2 className="text-2xl font-bold">
                      {r.restaurant?.name || "No Restaurant"}
                    </h2>
<p>
  📍 {r.restaurant?.location?.city || "Unknown City"}
</p>
                    
                    

                    <span
                      className={`px-4 py-1 text-xs rounded-full font-semibold ${
                        r.status === "booked"
                          ? "bg-green-400/20 text-green-300"
                          : "bg-gray-400/20 text-gray-300"
                      }`}
                    >
                      {r.status.toUpperCase()}
                    </span>

                  </div>

                  <div className="mt-4 space-y-1 text-gray-300 text-sm">

                    <p>📅 {new Date(r.date).toLocaleDateString()}</p>
                    <p>⏰ {r.time}</p>
                    <p>👥 {r.partySize} Guests</p>

                  </div>

                  {/* Buttons */}
                  {r.status === "booked" && (
                    <div className="flex gap-4 mt-6">

                      <Link
                        to={`/update-reservation/${r._id}`}
                        className="flex-1 text-center py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition shadow-md"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => cancelReservation(r._id)}
                        className="flex-1 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition shadow-md"
                      >
                        Cancel
                      </button>

                    </div>
                  )}

                </div>

              </div>

            </div>


))}

        </div>
      )}

    </div>
  );
}

export default MyReservations;