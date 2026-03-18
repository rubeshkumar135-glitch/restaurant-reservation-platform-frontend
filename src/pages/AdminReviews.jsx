import { useEffect, useState } from "react";
import API from "../services/api";
import { FaStar, FaTrash } from "react-icons/fa";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized");
        return;
      }

      const res = await API.get("/api/admin/allreviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    const confirmDelete = window.confirm("Delete this review?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/api/admin/deletereview/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // instant UI update
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // ⭐ Star renderer
  const renderStars = (rating = 0) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={i < rating ? "" : "opacity-30"} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-orange-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-6 text-center">
          ⭐ All Reviews
        </h2>

        {/* Loading */}
        {loading && (
          <p className="text-center text-orange-600 text-lg">Loading...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {/* Empty */}
        {!loading && reviews.length === 0 && (
          <p className="text-center text-gray-500">No Reviews Found</p>
        )}

        {/* Reviews Grid */}
        {!loading && reviews.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-xl transition duration-300"
              >

                <div className="p-5">

                  {/* Header */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-orange-600">
                      {review.user?.name || "Unknown"}
                    </h3>
                    {renderStars(review.rating)}
                  </div>

                  {/* Restaurant */}
                  <p className="text-sm text-gray-500 mb-2">
                    🍽️ {review.restaurant?.name || "Unknown"}
                  </p>

                  {/* Comment */}
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {review.comment}
                  </p>

                  {/* Footer */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>

                    <button
                      onClick={() => deleteReview(review._id)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminReviews;