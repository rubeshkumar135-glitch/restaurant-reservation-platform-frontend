import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function UpdateReservation() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    partySize: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const updateReservation = async () => {

    try {

      const token = localStorage.getItem("token");

      await API.put(
        `/api/reservations/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Reservation updated");

      navigate("/my-reservations");

    } catch (error) {
      console.log(error);
    }

  };

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-2xl text-yellow-400 mb-4">
        Update Reservation
      </h1>

      <input
        type="date"
        name="date"
        onChange={handleChange}
        className="inputStyle"
      />

      <input
        type="number"
        name="time"
        placeholder="Time"
        onChange={handleChange}
        className="inputStyle mt-3"
      />

      <input
        type="number"
        name="partySize"
        placeholder="Guests"
        onChange={handleChange}
        className="inputStyle mt-3"
      />

      <button
        onClick={updateReservation}
        className="bg-yellow-500 px-4 py-2 mt-4 rounded"
      >
        Update
      </button>

    </div>

  );
}

export default UpdateReservation;