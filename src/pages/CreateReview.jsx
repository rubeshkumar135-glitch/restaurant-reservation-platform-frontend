import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateReview() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
    photos: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔐 AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // ⭐ Rating
  const handleRating = (value) => {
    setFormData({ ...formData, rating: value });
  };

  // 💬 Input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📷 Image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({ ...formData, photos: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🚀 Submit
  const submitReview = async (e) => {
    e.preventDefault();

    if (!restaurantId) return alert("Restaurant ID missing");
    if (!formData.rating) return alert("Select rating");
    if (!formData.comment.trim()) return alert("Comment required");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const form = new FormData();
      form.append("restaurantId", restaurantId);
      form.append("rating", formData.rating);
      form.append("comment", formData.comment);

      if (formData.photos) {
        form.append("photos", formData.photos);
      }

      await API.post("/api/reviews/create", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Review submitted");

      setFormData({ rating: 0, comment: "", photos: null });
      setPreview(null);

      // ✅ Redirect after success
      navigate(`/reviews/${restaurantId}`);
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-indigo-900 px-4 text-white">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          ⭐ Write a Review
        </h2>

        <form onSubmit={submitReview} className="space-y-5">
          {/* ⭐ Star Rating */}
          <div className="flex justify-center gap-2 text-3xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRating(star)}
                className={`cursor-pointer transition transform hover:scale-125 ${
                  star <= formData.rating ? "text-yellow-400" : "text-gray-500"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          {/* 💬 Comment */}
          <textarea
            name="comment"
            value={formData.comment}
            placeholder="💬 Share your experience..."
            onChange={handleChange}
            rows="4"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-400 outline-none placeholder-gray-300"
          />

          {/* 📷 Upload */}
          <label className="block cursor-pointer">
            <div className="p-4 border border-dashed border-white/30 rounded-xl text-center hover:bg-white/10 transition">
              📷 Upload Photo
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* 🔍 Preview */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-full h-40 object-cover rounded-xl shadow-lg"
            />
          )}

          {/* 🚀 Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition transform ${
              loading
                ? "bg-gray-500"
                : "bg-gradient-to-r from-pink-500 to-indigo-500 hover:scale-105 shadow-lg"
            }`}
          >
            {loading ? "Submitting..." : "🚀 Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateReview;
