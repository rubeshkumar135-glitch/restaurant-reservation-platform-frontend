import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

function RestaurantReviews() {
  const { restaurantId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [user, setUser] = useState(null);

  // 🔥 LOAD DATA
  useEffect(() => {
    fetchReviews();
    getUser();
  }, [restaurantId]);

  // 👤 GET USER
  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // 📥 GET REVIEWS
  const fetchReviews = async () => {
    try {
      const res = await API.get(
        `/api/reviews/restaurant/${restaurantId}`
      );

      setReviews(res.data || []);

    } catch (error) {
      console.log(error);
    }
  };

  // ❌ DELETE REVIEW
  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/api/reviews/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReviews((prev) => prev.filter((r) => r._id !== id));

    } catch (error) {
      console.log(error);
    }
  };

  // ⭐ STAR UI
  const renderStars = (rating = 0) => (
    <div className="flex text-yellow-400 text-lg">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );

  // 🔥 SEND OWNER REPLY
  const sendReply = async (reviewId) => {

    if (!replyText[reviewId]?.trim()) {
      return alert("Enter reply");
    }

    try {
      const token = localStorage.getItem("token");

      await API.post(
        `/api/reviews/owner-response/${reviewId}`,
        { message: replyText[reviewId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // clear input
      setReplyText((prev) => ({
        ...prev,
        [reviewId]: ""
      }));

      // refresh
      fetchReviews();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 p-4 md:p-8 text-white">

      <div className="max-w-5xl mx-auto">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          ⭐ Restaurant Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center">
            No reviews yet
          </p>
        ) : (

          <div className="grid gap-6 md:grid-cols-2">

            {reviews.map((review) => (

              <div
                key={review._id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg"
              >
                <div className="p-5">

                  {/* 👤 HEADER */}
                  <div className="flex justify-between items-center mb-2">

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 flex items-center justify-center text-sm font-bold">
                        {review.user?.name?.charAt(0) || "U"}
                      </div>

                      <h3>{review.user?.name}</h3>
                    </div>

                    {renderStars(review.rating)}
                  </div>

                  {/* 💬 COMMENT */}
                  <p className="text-gray-300 mb-3">
                    {review.comment}
                  </p>

                  {/* 🖼 REVIEW IMAGES */}
{review.photos && review.photos.length > 0 && (
  <div className="flex gap-2 mt-3 overflow-x-auto">
    {review.photos.map((img, index) => (
      <img
        key={index}
        src={`https://restaurant-reservation-platform-backend.onrender.com/${img}`}
        alt="review"
        className="w-20 h-20 object-cover rounded-lg border border-white/20 hover:scale-105 transition"
      />
    ))}
  </div>
)}

                  {/* ✅ OWNER REPLY SHOW */}
                  {review.ownerResponse && (
                    <div className="bg-green-900/40 p-3 rounded mb-3">
                      <p className="text-green-300 text-sm font-semibold">
                        Owner Reply:
                      </p>
                      <p className="text-gray-200 text-sm">
                        {review.ownerResponse.message}
                      </p>
                    </div>
                  )}

                  {/* 🔥 OWNER INPUT (ONLY OWNER) */}
                  {user &&
                    review.restaurant?.owner?.toString() === user._id &&
                    !review.ownerResponse && (

                      <div className="mb-3">

                        <input
                          type="text"
                          placeholder="Reply to this review..."
                          value={replyText[review._id] || ""}
                          onChange={(e) =>
                            setReplyText({
                              ...replyText,
                              [review._id]: e.target.value
                            })
                          }
                          className="w-full p-2 rounded bg-white/10"
                        />

                        <button
                          onClick={() => sendReply(review._id)}
                          className="mt-2 px-3 py-1 bg-green-500 rounded"
                        >
                          Reply
                        </button>

                      </div>
                    )}

                  {/* 📅 FOOTER */}
                  <div className="flex justify-between items-center">

                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex gap-2">

                      <Link
                        to={`/update-review/${review._id}`}
                        className="bg-indigo-500 px-3 py-1 rounded text-sm"
                      >
                        ✏️
                      </Link>

                      <button
                        onClick={() => deleteReview(review._id)}
                        className="bg-red-500 px-3 py-1 rounded text-sm"
                      >
                        🗑
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