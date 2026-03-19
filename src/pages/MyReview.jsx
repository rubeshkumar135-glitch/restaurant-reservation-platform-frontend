import { useEffect, useState } from "react";
import API from "../services/api";

function MyReview() {

  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState({});
  const [replyText, setReplyText] = useState({});

  // 🔥 fetch owner restaurants
  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/restaurants/owner", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRestaurants(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 fetch reviews per restaurant
  const fetchReviews = async (restaurantId) => {
    try {
      const res = await API.get(`/api/reviews/restaurant/${restaurantId}`);

      setReviews(prev => ({
        ...prev,
        [restaurantId]: res.data
      }));

    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 load data
  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    restaurants.forEach(r => fetchReviews(r._id));
  }, [restaurants]);

  // 🔥 send reply
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
      setReplyText(prev => ({ ...prev, [reviewId]: "" }));

      // refresh reviews
      fetchRestaurants();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 text-white">

      <h1 className="text-2xl mb-6">My Reviews</h1>

      {restaurants.map((restaurant) => (

        <div key={restaurant._id} className="mb-6 bg-white/10 p-4 rounded">

          <h2 className="text-lg font-bold mb-3">
            {restaurant.name}
          </h2>

          {/* 🔥 REVIEWS */}
          {(reviews[restaurant._id] || []).map((review) => (

            <div key={review._id} className="bg-black/30 p-3 rounded mb-3">

              <p className="text-sm text-gray-300">
                {review.user?.name}: {review.comment}
              </p>

              {/* ✅ SHOW OWNER REPLY */}
              {review.ownerResponse && (
                <p className="text-green-400 text-sm mt-1">
                  Owner: {review.ownerResponse.message}
                </p>
              )}

              {/* 🔥 INPUT */}
              {!review.ownerResponse && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Reply..."
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

            </div>

          ))}

        </div>

      ))}

    </div>
  );
}

export default MyReview;