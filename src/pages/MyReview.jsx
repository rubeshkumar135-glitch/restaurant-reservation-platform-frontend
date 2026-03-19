import { useEffect, useState } from "react";
import API from "../services/api";

function MyReview() {
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState({});
  const [replyText, setReplyText] = useState({});

  // FETCH RESTAURANTS
  const fetchRestaurants = async () => {
    const token = localStorage.getItem("token");

    const res = await API.get("/api/restaurants/owner", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setRestaurants(res.data);
  };

  // FETCH REVIEWS
  const fetchReviews = async (restaurantId) => {
    const res = await API.get(`/api/reviews/restaurant/${restaurantId}`);

    setReviews((prev) => ({
      ...prev,
      [restaurantId]: res.data,
    }));
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    restaurants.forEach((r) => fetchReviews(r._id));
  }, [restaurants]);

  // SEND REPLY
  const sendReply = async (reviewId) => {
    const token = localStorage.getItem("token");

    await API.post(
      `/api/reviews/owner-response/${reviewId}`,
      { message: replyText[reviewId] },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    alert("Reply sent! ✅");

    setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
    fetchRestaurants();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 text-white px-6 py-20">
      {/* HEADER */}
      <div className="text-center mt-12 mb-12">
        <h1 className="text-5xl font-extrabold text-indigo-400">My Reviews</h1>
        <p className="text-gray-400 mt-2">Manage your customer feedback 💬</p>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center mt-20 text-gray-400">
          No restaurants found
        </div>
      ) : (
        <div className="grid gap-10">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl hover:border-indigo-400 transition p-6"
            >
              {/* RESTAURANT NAME */}
              <h2 className="text-xl font-bold text-indigo-400 mb-4">
                🍽 {restaurant.name}
              </h2>

              {/* NO REVIEWS */}
              {(reviews[restaurant._id] || []).length === 0 ? (
                <p className="text-gray-400">No reviews yet</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {(reviews[restaurant._id] || []).map((review) => (
                    <div
                      key={review._id}
                      className="bg-black/40 border border-white/10 rounded-xl p-4 hover:scale-[1.02] transition"
                    >
                      {/* USER */}
                      <p className="text-indigo-300 font-semibold text-lg">
                        {review.user?.name}
                      </p>

                      {/* COMMENT */}
                      <p className="text-gray-300 text-sm mt-1">
                        {review.comment}
                      </p>

                      {/* OWNER RESPONSE */}
                      {review.ownerResponse && (
                        <div className="mt-3 p-3 bg-green-900/40 rounded border border-green-500/30">
                          <p className="text-green-300 text-xs font-semibold">
                            Owner Reply
                          </p>
                          <p className="text-gray-200 text-sm">
                            {review.ownerResponse.message}
                          </p>
                        </div>
                      )}

                      {/* INPUT */}
                      {!review.ownerResponse && (
                        <div className="mt-3">
                          <input
                            type="text"
                            placeholder="Reply to customer..."
                            value={replyText[review._id] || ""}
                            onChange={(e) =>
                              setReplyText({
                                ...replyText,
                                [review._id]: e.target.value,
                              })
                            }
                            className="w-full p-2 rounded bg-black/30 border border-white/20 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          />

                          <button
                            onClick={() => sendReply(review._id)}
                            className="mt-2 w-full bg-indigo-500 hover:bg-indigo-600 py-1 rounded font-semibold text-sm transition"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReview;
