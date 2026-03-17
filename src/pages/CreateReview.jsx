import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function CreateReview() {
  const { restaurantId } = useParams();

  const [formData, setFormData] = useState({
    rating: "",
    comment: "",
    photos: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Prevent invalid rating input manually
    if (name === "rating") {
      if (value === "") {
        setFormData({ ...formData, rating: "" });
        return;
      }

      const num = Number(value);

      if (num < 1 || num > 5) {
        return; // ignore invalid input
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const submitReview = async (e) => {
    e.preventDefault();

    // Final validation
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    if (!formData.comment.trim()) {
      alert("Comment is required");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await API.post(
        "/api/reviews/create",
        {
          restaurantId,
          rating: Number(formData.rating),
          comment: formData.comment,
          photos: formData.photos ? [formData.photos] : []
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("✅ Review added successfully");

      // Reset form
      setFormData({
        rating: "",
        comment: "",
        photos: ""
      });

    } catch (error) {
      console.error("Error creating review:", error);
      alert("❌ Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 via-indigo-50 to-purple-100 px-4">
      
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          Write a Review
        </h2>

        <form onSubmit={submitReview} className="space-y-4">

          {/* Rating */}
          <input
            type="number"
            name="rating"
            value={formData.rating}
            placeholder="Rating (1 - 5)"
            min="1"
            max="5"
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* Comment */}
          <textarea
            name="comment"
            value={formData.comment}
            placeholder="Write your experience..."
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* Photo URL */}
          <input
            type="text"
            name="photos"
            value={formData.photos}
            placeholder="Photo URL (optional)"
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateReview;