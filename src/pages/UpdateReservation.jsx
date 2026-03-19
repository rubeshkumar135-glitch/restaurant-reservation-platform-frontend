import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function UpdateReservation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    partySize: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateReservation = async () => {
    if (!formData.date || !formData.time || !formData.partySize) {
      return alert("All fields required");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await API.put(`/api/reservations/update/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Reservation updated");
      navigate("/my-reservations");
    } catch (error) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-indigo-900 px-4 text-white">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          ✏️ Edit Reservation
        </h1>

        <div className="space-y-5">
          {/* Date */}
          <div>
            <label className="text-sm text-gray-300">📅 Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Time */}
          <div>
            <label className="text-sm text-gray-300">⏰ Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Guests */}
          <div>
            <label className="text-sm text-gray-300">👥 Guests</label>
            <input
              type="number"
              name="partySize"
              value={formData.partySize}
              onChange={handleChange}
              min="1"
              className="w-full p-3 mt-1 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Button */}
          <button
            onClick={updateReservation}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition transform ${
              loading
                ? "bg-gray-500"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 shadow-lg"
            }`}
          >
            {loading ? "Updating..." : "🚀 Update Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateReservation;
