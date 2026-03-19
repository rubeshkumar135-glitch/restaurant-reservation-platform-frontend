import { useEffect, useState } from "react";
import API from "../services/api";
import { FaStar, FaTrash } from "react-icons/fa";

function AdminReviews() {
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/admin/allreviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
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

      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  //  Stars
  const renderStars = (rating = 0) => (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} className={i < rating ? "" : "opacity-30"} />
      ))}
    </div>
  );

  //  THEME
  const pageBg = isAdmin
    ? "bg-orange-50"
    : "bg-gradient-to-br from-black via-gray-900 to-indigo-900";

  const containerBg = isAdmin
    ? "bg-white text-gray-800"
    : "bg-white/10 text-white backdrop-blur border border-white/20";

  const headerBg = isAdmin
    ? "bg-orange-500 text-white"
    : "bg-indigo-600 text-white";

  const rowHover = isAdmin ? "hover:bg-orange-100" : "hover:bg-white/10";

  const textMuted = isAdmin ? "text-gray-500" : "text-gray-300";

  return (
    <div className={`min-h-screen p-4 md:p-8 ${pageBg}`}>
      <div
        className={`max-w-7xl mt-32 mx-auto shadow-lg rounded-lg p-4 md:p-6 ${containerBg}`}
      >
        <h2
          className={`text-xl md:text-3xl font-bold mb-6 text-center ${
            isAdmin ? "text-orange-600" : "text-white"
          }`}
        >
          ⭐ All Reviews
        </h2>

        {/* 📱 Responsive wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm md:text-base">
            {/* HEADER */}
            <thead>
              <tr className={headerBg}>
                <th className="p-2 md:p-3 text-left">User</th>
                <th className="p-2 md:p-3 text-left">Restaurant</th>
                <th className="p-2 md:p-3 text-left">Rating</th>
                <th className="p-2 md:p-3 text-left hidden md:table-cell">
                  Comment
                </th>
                <th className="p-2 md:p-3 text-left hidden md:table-cell">
                  Date
                </th>
                <th className="p-2 md:p-3 text-left">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-6">
                    Loading...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6">
                    No Reviews Found
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr
                    key={review._id}
                    className={`border-b transition ${rowHover}`}
                  >
                    {/* USER */}
                    <td className="p-2 md:p-3">
                      {review.user?.name || "Unknown"}
                    </td>

                    {/* RESTAURANT */}
                    <td className="p-2 md:p-3">
                      {review.restaurant?.name || "Unknown"}
                    </td>

                    {/* RATING */}
                    <td className="p-2 md:p-3">{renderStars(review.rating)}</td>

                    {/* COMMENT (hide mobile) */}
                    <td className="p-2 md:p-3 max-w-xs truncate hidden md:table-cell">
                      {review.comment}
                    </td>

                    {/* DATE (hide mobile) */}
                    <td
                      className={`p-2 md:p-3 ${textMuted} hidden md:table-cell`}
                    >
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* ACTION */}
                    <td className="p-2 md:p-3">
                      <button
                        onClick={() => deleteReview(review._id)}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminReviews;
