import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function UpdateReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ⭐ Rating
  const handleRating = (value) => {
    setRating(value);
  };

  // 📷 Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const updateReview = async () => {
    if (!rating) return alert("Select rating");
    if (!comment.trim()) return alert("Comment required");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const form = new FormData();
      form.append("rating", rating);
      form.append("comment", comment);

      if (photo) {
        form.append("photos", photo);
      }

      await API.put(`/api/reviews/update/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Review updated");
      navigate(-1);
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-indigo-900 px-4 text-white">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          ✏️ Edit Your Review
        </h2>

        {/* ⭐ Rating */}
        <div className="flex justify-center gap-2 text-3xl mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleRating(star)}
              className={`cursor-pointer transition transform hover:scale-125 ${
                star <= rating ? "text-yellow-400" : "text-gray-500"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* 💬 Comment */}
        <textarea
          placeholder="Update your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-400 outline-none placeholder-gray-300 mb-4"
        />

        {/* 📷 Upload */}
        <label className="block cursor-pointer mb-4">
          <div className="p-4 border border-dashed border-white/30 rounded-xl text-center hover:bg-white/10 transition">
            📷 Change Photo
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-40 object-cover rounded-xl mb-4 shadow-lg"
          />
        )}

        {/* Button */}
        <button
          onClick={updateReview}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition transform ${
            loading
              ? "bg-gray-500"
              : "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:scale-105 shadow-lg"
          }`}
        >
          {loading ? "Updating..." : "🚀 Update Review"}
        </button>
      </div>
    </div>
  );
}

export default UpdateReview;
