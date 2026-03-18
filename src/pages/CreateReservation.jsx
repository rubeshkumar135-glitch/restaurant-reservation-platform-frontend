import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateReservation() {

  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    partySize: ""
  });

  const [availability, setAvailability] = useState(null);
  const [reservation, setReservation] = useState(null);

  // 🔐 AUTH CHECK (same logic)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const checkAvailability = async () => {
    try {
      const res = await API.get("/api/reservations/availability", {
        params: {
          restaurantId,
          date: formData.date,
          time: formData.time
        }
      });
      setAvailability(res.data);
    } catch (error) {
      alert("Failed to check availability");
    }
  };

  const submitReservation = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/api/reservations/create",
        {
          restaurantId,
          date: formData.date,
          time: formData.time,
          partySize: formData.partySize
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setReservation(res.data);
      setFormData({ date: "", time: "", partySize: "" });

    } catch (error) {
      alert(error.response?.data?.message || "Reservation failed");
    }
  };

  const handlePayment = async () => {
    try {
      const res = await API.post("/api/payment/checkout", {
        reservationId: reservation._id,
        price: 20
      });

      window.location.href = res.data.url;

    } catch (error) {
      alert("Payment failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-indigo-900 px-4 text-white">

      <div className="w-full max-w-md">

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8">

          <h1 className="text-3xl font-bold text-center mb-8 tracking-wide">
            🍽️ Book Your Table
          </h1>

          <form onSubmit={submitReservation} className="space-y-5">

            {/* Date */}
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />

            {/* Time */}
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />

            {/* Guests */}
            <input
              type="number"
              name="partySize"
              placeholder="👥 Number of Guests"
              value={formData.partySize}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-400 outline-none placeholder-gray-300"
              required
              min="1"
            />

            {/* Check Availability */}
            <button
              type="button"
              onClick={checkAvailability}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition transform shadow-lg"
            >
              🔍 Check Availability
            </button>

            {/* Availability */}
            {availability && (
              <div
                className={`text-center p-3 rounded-xl text-sm font-semibold ${
                  availability.isAvailable
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {availability.isAvailable
                  ? `✅ ${availability.availableSeats} seats available`
                  : "❌ No seats available"}
              </div>
            )}

            {/* Reserve */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-105 transition transform shadow-lg"
            >
              🚀 Reserve Now
            </button>

          </form>

          {/* Payment */}
          {reservation && (
            <div className="mt-8 text-center">

              <p className="text-green-400 font-semibold mb-4 text-lg">
                🎉 Reservation Confirmed!
              </p>

              <button
                onClick={handlePayment}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold hover:scale-105 transition transform shadow-lg"
              >
                💳 Pay Now
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default CreateReservation;