import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function OwnerResponse() {

  const { reviewId } = useParams(); // 🔥 IMPORTANT
  const [message, setMessage] = useState("");

  const sendResponse = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        `/api/reviews/owner-response/${reviewId}`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Response sent");

    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="bg-black text-white p-6 min-h-screen">

      <h2 className="text-yellow-400 text-xl mb-4">
        Respond to Review
      </h2>

      <textarea
        placeholder="Write response"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 rounded bg-white/10"
      />

      <button
        onClick={sendResponse}
        className="bg-yellow-500 px-4 py-2 mt-4 rounded"
      >
        Send Response
      </button>

    </div>
  );
}

export default OwnerResponse;