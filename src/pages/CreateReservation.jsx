import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";


function CreateReservation() {

  const { restaurantId } = useParams();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    partySize: ""
  });

  const [availability, setAvailability] = useState(null);
  const [reservation, setReservation] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Check availability
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

      console.log(error);

      alert("Failed to check availability");

    }

  };

  // Create reservation
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
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setReservation(res.data);

      alert("Reservation created successfully");

      setFormData({
        date: "",
        time: "",
        partySize: ""
      });

    } catch (error) {

      alert(error.response?.data?.message || "Reservation failed");

    }

  };

  // Handle Stripe payment
 const handlePayment = async () => {

  try {

    const res = await API.post(
      "/api/payment/checkout",
      {
        reservationId: reservation._id,
        price: 20
      }
    );

    // Redirect directly to Stripe checkout page
    window.location.href = res.data.url;

  } catch (error) {

    console.log(error);
    alert("Payment failed");

  }

};

  return (

    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 via-indigo-50 to-purple-100 px-4">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          Reserve a Table
        </h1>

        <form onSubmit={submitReservation} className="space-y-4">

          {/* Date */}

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          {/* Time */}

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          {/* Party Size */}

          <input
            type="number"
            name="partySize"
            placeholder="Number of Guests"
            value={formData.partySize}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
            min="1"
          />

          {/* Check Availability */}

          <button
            type="button"
            onClick={checkAvailability}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-lg transition"
          >
            Check Availability
          </button>

          {/* Availability Result */}

          {availability && (
            <div
              className={`p-3 rounded-lg text-center text-sm font-medium ${
                availability.isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {availability.isAvailable
                ? `Available seats: ${availability.availableSeats}`
                : "No seats available"}
            </div>
          )}

          {/* Reserve Button */}

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg transition"
          >
            Reserve Table
          </button>

        </form>

        {/* Payment Section */}

        {reservation && (

          <div className="mt-6 text-center">

            <p className="text-green-600 font-semibold mb-3">
              Reservation Created Successfully
            </p>

            <button
              onClick={handlePayment}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-semibold"
            >
              Pay Now
            </button>

          </div>

        )}

      </div>

    </div>

  );
}

export default CreateReservation;