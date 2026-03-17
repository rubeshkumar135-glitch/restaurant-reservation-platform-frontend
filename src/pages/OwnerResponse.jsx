import { useState } from "react";
import API from "../services/api";

function OwnerResponse({ reviewId }) {

  const [message, setMessage] = useState("");

  const sendResponse = async () => {

    try {

      await API.put(`/api/reviews/owner-response/${reviewId}`, {
        message
      });

      alert("Response sent");

    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="bg-black text-white p-6">

      <h2 className="text-yellow-400 text-xl mb-4">
        Respond to Review
      </h2>

      <textarea
        placeholder="Write response"
        onChange={(e) => setMessage(e.target.value)}
        className="inputStyle"
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