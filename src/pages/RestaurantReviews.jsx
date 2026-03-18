import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

function RestaurantReviews() {
  const { restaurantId } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (restaurantId) {
      fetchReviews();
    }
  }, [restaurantId]);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/api/reviews/restaurant/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteReview = async (id) => {
    const confirmDelete = window.confirm("Delete this review?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/api/reviews/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // ⭐ Stars
  const renderStars = (rating = 0) => {
    return (
      <div className="flex text-yellow-400 text-lg">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 p-4 md:p-8 text-white">

      <div className="max-w-5xl mx-auto">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          ⭐ Restaurant Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center">No reviews yet</p>
        ) : (

          <div className="grid gap-6 md:grid-cols-2">

            {reviews.map((review) => (

              <div
                key={review._id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden"
              >

                <div className="p-5">

                  {/* Header */}
                  <div className="flex justify-between items-center mb-2">

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 flex items-center justify-center text-sm font-bold">
                        {review.user?.name?.charAt(0) || "U"}
                      </div>

                      <h3 className="font-semibold">
                        {review.user?.name || "User"}
                      </h3>
                    </div>

                    {renderStars(review.rating)}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {review.comment}
                  </p>

                  {/* Footer */}
                  <div className="flex justify-between items-center">

                    <span className="text-xs text-gray-400">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : ""}
                    </span>

                    <div className="flex gap-2">

                      <Link
                        to={`/update-review/${review._id}`}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-sm transition"
                      >
                        ✏️ Edit
                      </Link>

                      <button
                        onClick={() => deleteReview(review._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
                      >
                        🗑 Delete
                      </button>

                    </div>

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

export default RestaurantReviews;