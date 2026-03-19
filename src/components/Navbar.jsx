import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // 🔥 FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) fetchUser();
  }, [token]);

  const isActive = (path) =>
    location.pathname === path ? "text-indigo-400" : "";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-gray-900 to-indigo-900 backdrop-blur-xl border-b border-white/10 shadow-lg">
      
      <div className="max-w-8xl mx-auto px-4 md:px-10 py-6 flex justify-between items-center text-white">

        {/* 🍽 LOGO */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold tracking-wide hover:scale-105 transition"
        >
          🍽 FoodieHub
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">

          <Link
            to="/"
            className={`text-lg hover:text-indigo-400 transition ${isActive("/")}`}
          >
            Home
          </Link>

          {token && (
            <Link
              to="/my-reservations"
              className={`text-lg hover:text-indigo-400 transition ${isActive("/my-reservations")}`}
            >
              My Reservations
            </Link>
          )}

          {/* 👤 PROFILE IMAGE */}
          {token && user && (
            <Link to="/profile">
              <img
                src={
                  user.profileImage
                    ? `https://restaurant-reservation-platform-backend.onrender.com/${user.profileImage}`
                    : `https://ui-avatars.com/api/?name=${user.name}`
                }
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white hover:scale-110 transition"
              />
            </Link>
          )}

          {/* LOGIN / REGISTER */}
          {!token && (
            <>
              <Link
                to="/login"
                className="px-6 py-2 rounded-full border border-white/30 hover:bg-white/10"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-6 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl px-6 py-4 space-y-4 text-white">

          {/* 👤 PROFILE IMAGE */}
          {token && user && (
            <div className="flex justify-center mb-4">
              <img
                src={
                  user.profileImage
                    ? `https://restaurant-reservation-platform-backend.onrender.com/${user.profileImage}`
                    : `https://ui-avatars.com/api/?name=${user.name}`
                }
                className="w-14 h-14 rounded-full border-2 border-white"
              />
            </div>
          )}

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-indigo-400"
          >
            Home
          </Link>

          {token && (
            <Link
              to="/my-reservations"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-indigo-400"
            >
              My Reservations
            </Link>
          )}

          {!token && (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-center py-2 border rounded-full"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block text-center py-2 rounded-full bg-indigo-500"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;