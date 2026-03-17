import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

function RestaurantReviews() {

  const { restaurantId } = useParams();

  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await API.get(`/api/reviews/restaurant/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReviews(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchReviews();
    }
  }, [restaurantId]);

  const deleteReview = async (id) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this review?");

    if (!confirmDelete) return;

    try {

      const token = localStorage.getItem("token");

      await API.delete(`/api/reviews/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReviews(reviews.filter((review) => review._id !== id));

      alert("Review deleted successfully");

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50 to-purple-100 px-4 md:px-10 py-10">

      <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        Restaurant Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center">No reviews yet</p>
      ) : (

        <div className="max-w-3xl mx-auto space-y-6">

          {reviews.map((review) => (

            <div
              key={review._id}
              className="bg-white shadow-md rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
            >

              <h3 className="text-lg font-semibold text-indigo-600">
                {review.user?.name}
              </h3>

              <p className="mt-1 text-yellow-500 font-medium">
                ⭐ {review.rating}
              </p>

              <p className="mt-2 text-gray-600">
                {review.comment}
              </p>

              {/* Buttons */}

              <div className="flex flex-wrap gap-3 mt-4">

                <Link
                  to={`/update-review/${review._id}`}
                  className="bg-indigo-500 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-600 transition"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteReview(review._id)}
                  className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default RestaurantReviews;