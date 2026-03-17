import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function UpdateReview() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const updateReview = async () => {

    try {

      const token = localStorage.getItem("token");

      await API.put(
        `/api/reviews/update/${id}`,
        {
          rating,
          comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Review updated successfully");

      navigate(-1); // go back to previous page

    } catch (error) {

      console.log(error);

      alert(error.response?.data?.message || "Update failed");

    }

  };

  return (

    <div className="min-h-screen bg-black text-white p-6">

      <h2 className="text-yellow-400 text-2xl mb-4">
        Update Review
      </h2>

      <input
        type="number"
        placeholder="Rating (1-5)"
        onChange={(e) => setRating(e.target.value)}
        className="w-full p-3 bg-gray-800 rounded"
      />

      <textarea
        placeholder="Comment"
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-3 bg-gray-800 rounded mt-3"
      />

      <button
        onClick={updateReview}
        className="bg-yellow-500 px-5 py-2 mt-4 rounded hover:bg-yellow-600 text-black"
      >
        Update Review
      </button>

    </div>

  );
}

export default UpdateReview;