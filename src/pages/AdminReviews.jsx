import { useEffect, useState } from "react";
import API from "../services/api";

function AdminReviews() {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {

    const token = localStorage.getItem("token");

    const res = await API.get("/api/admin/allreviews", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setReviews(res.data);
  };

  const deleteReview = async (id) => {

    const confirmDelete = window.confirm("Delete this review?");

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    await API.delete(`/api/admin/deletereview/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchReviews();
  };

  return (

    <div className="min-h-screen bg-orange-50 p-4 md:p-8">

      <div className="max-w-6xl mx-auto">

        <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-6 text-center">
          ⭐ All Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">No Reviews Found</p>
        ) : (

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {reviews.map((review) => (

              <div
                key={review._id}
                className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg transition"
              >

                <p className="mb-2">
                  <span className="font-semibold text-orange-600">User:</span>{" "}
                  {review.user?.name || "Unknown"}
                </p>

                <p className="mb-2">
                  <span className="font-semibold text-orange-600">Restaurant:</span>{" "}
                  {review.restaurant?.name || "Unknown"}
                </p>

                <p className="mb-4 text-gray-700">
                  <span className="font-semibold text-orange-600">Review:</span>{" "}
                  {review.comment}
                </p>

                <button
                  onClick={() => deleteReview(review._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
                >
                  Delete
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );
}

export default AdminReviews;