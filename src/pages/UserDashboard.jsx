import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function UserDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const res = await API.get("/api/restaurants");
      setRestaurants(res.data);
      setAllRestaurants(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // 🔍 SEARCH FUNCTION
  const handleSearch = (value) => {
    setSearch(value);

    if (!value.trim()) {
      setRestaurants(allRestaurants);
      return;
    }

    const lower = value.toLowerCase();

    const ratingMatch = lower.match(/(\d+)/);
    const ratingValue = ratingMatch ? Number(ratingMatch[1]) : null;

    const filtered = allRestaurants.filter((r) => {
      const name = r.name?.toLowerCase() || "";
      const city = r.location?.city?.toLowerCase() || "";
      const cuisine = Array.isArray(r.cuisineTypes)
        ? r.cuisineTypes.join(" ").toLowerCase()
        : (r.cuisineTypes || "").toLowerCase();

      const price = r.priceRange?.toLowerCase() || "";
      const rating = Number(r.averageRating) || 0;

      return (
        // 🔥 TEXT MATCH
        name.includes(lower) ||
        city.includes(lower) ||
        cuisine.includes(lower) ||
        // ⭐ RATING MATCH
        (ratingValue && rating >= ratingValue) ||
        // 💰 PRICE MATCH
        (lower.includes("l", "lo", "low") && price === "low") ||
        (lower.includes("c", "ch", "che", "cheap") && price === "low") ||
        (lower.includes("m", "me", "med", "medi", "medium") &&
          price === "medium") ||
        (lower.includes("h", "hi", "hig", "high") && price === "high") ||
        (lower.includes("ex", "expen", "expensi", "expensive") &&
          price === "high")
      );
    });

    setRestaurants(filtered);
  };

  return (
    <div className="min-h-screen   bg-gradient-to-br from-black via-gray-900 to-indigo-900 px-4 md:px-10 py-20 text-white">
      {/* 🔥 HERO */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          🍽 Discover Amazing Restaurants
        </h1>
        <p className="text-gray-400">
          Find the best food, reviews & reserve your table instantly
        </p>
      </div>

      {/* 🔍 SEARCH */}
      <div className="flex justify-center mb-12">
        <input
          type="text"
          placeholder="Search food, city, cuisine, or '4 star'..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full md:w-1/2 p-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl focus:ring-2 focus:ring-indigo-400 outline-none placeholder-gray-300"
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : restaurants.length === 0 ? (
        <div className="text-center mt-20">
          <h2 className="text-xl text-gray-400">No results found 😔</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((r) => (
            <div
              key={r._id}
              className="group rounded-2xl overflow-hidden shadow-lg hover:scale-[1.03] transition duration-300 bg-white/10 backdrop-blur-xl"
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={r.photos?.[0] || "https://via.placeholder.com/400"}
                  alt={r.name}
                  className="w-full  object-cover group-hover:scale-110 transition duration-300"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    {r.name}
                  </h2>

                  <p className="text-sm md:text-lg text-gray-300">
                    📍 {r.location?.city}
                  </p>

                  {/* ⭐ Stars */}
                  {/* <div className="flex text-yellow-400 text-sm md:text-lg mt-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const rating = Math.round(Number(r.averageRating) || 0);
                      return (
                        <span key={star}>{star <= rating ? "★" : "☆"}</span>
                      );
                    })}
                  </div> */}
                  <div className="flex items-center text-yellow-400 text-sm md:text-lg mt-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const rating = Math.round(Number(r.averageRating) || 0);
                      return (
                        <span key={star}>{star <= rating ? "★" : "☆"}</span>
                      );
                    })}

                    {/* ⭐ NUMBER */}
                    <span className="ml-2 text-white text-sm">
                      ({Number(r.averageRating || 0).toFixed(1)})
                    </span>
                  </div>

                  {/* 📝 REVIEW COUNT ADD panniten 👇 */}
                  <p className="text-gray-400 text-xs md:text-sm mt-1">
                    {r.totalReviews > 0
                      ? `${r.totalReviews} reviews`
                      : "No reviews yet"}
                  </p>
                </div>
              </div>

              {/* CARD BODY */}
              <div className="p-4 md:py-8 space-y-3">
                {/* ✅ DESCRIPTION FIX */}
                <p className="text-sm md:text-2xl text-gray-300 line-clamp-2">
                  Description : {r.description || "No description available"}
                </p>

                <p className="text-sm md:text-xl pt-1">
                  Cuisine : 🍴 {r.cuisineTypes}
                </p>
                <p className="text-sm md:text-xl pb-3">
                  Price Range : 💰 {r.priceRange}
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    to={`/reviews/${r._id}`}
                    className="px-4  py-1 text-xs md:text-xl rounded-full bg-indigo-500 hover:bg-indigo-600"
                  >
                    Reviews
                  </Link>

                  <Link
                    to={`/create-review/${r._id}`}
                    className="px-4  py-1 text-xs md:text-xl rounded-full bg-purple-500 hover:bg-purple-600"
                  >
                    Write
                  </Link>

                  <Link
                    to={`/create-reservation/${r._id}`}
                    className="px-4 py-1 text-xs md:text-xl rounded-full bg-emerald-500 hover:bg-emerald-600"
                  >
                    Reserve
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
