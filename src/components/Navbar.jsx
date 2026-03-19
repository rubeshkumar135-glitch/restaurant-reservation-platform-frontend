import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

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
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-gray-900 to-indigo-900 border-b border-white/10 backdrop-blur-xl shadow-lg">
        <div className="max-w-8xl mx-auto px-4 md:px-10 py-6 flex justify-between items-center text-white">
          {/* LOGO */}
          <p className="text-2xl md:text-3xl font-bold">🍽 FoodieHub</p>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">
            {user?.role === "user" && (
              <>
                <Link to="/" className={`text-lg ${isActive("/")}`}>
                  Home
                </Link>
                <Link to="/my-reservations" className="text-lg">
                  My Reservations
                </Link>
              </>
            )}

            {user?.role === "owner" && (
              <>
                <Link to="/ownerdashboard" className="text-lg">
                  Dashboard
                </Link>
                <Link to="/my-restaurants" className="text-lg">
                  My Restaurants
                </Link>
                <Link to="/my-reviews" className="text-lg">
                  Reviews
                </Link>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <Link
                  to="/admindashboard"
                  className={`text-lg ${isActive("/admindashboard")}`}
                >
                  Dashboard
                </Link>
                <Link to="/admin/restaurants" className="text-lg">
                  Restaurants
                </Link>
                <Link to="/admin/reservations" className="text-lg">
                  Reservations
                </Link>
                <Link to="/admin/users" className="text-lg">
                  Users
                </Link>
                <Link to="/admin/reviews" className="text-lg">
                  Reviews
                </Link>
              </>
            )}

            {/* PROFILE */}
            {token && user && (
              <Link to="/profile">
                <img
                  src={
                    user.profileImage ||
                    `https://ui-avatars.com/api/?name=${user.name}`
                  }
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              </Link>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/*  OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/*  SIDE DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 text-white">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={() => setMenuOpen(false)}>✖</button>
        </div>

        {/* PROFILE */}
        {user && (
          <div className="flex flex-col items-center p-4 text-white">
            <img
              src={
                user.profileImage ||
                `https://ui-avatars.com/api/?name=${user.name}`
              }
              className="w-16 h-16 rounded-full border-2 border-white mb-2"
            />
            <p className="text-sm">{user.name}</p>
          </div>
        )}

        {/* MENU ITEMS */}
        <div className="flex flex-col gap-4 p-4 text-white">
          {user?.role === "user" && (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                🏠 Home
              </Link>
              <Link to="/my-reservations" onClick={() => setMenuOpen(false)}>
                📅 My Reservations
              </Link>
            </>
          )}

          {user?.role === "owner" && (
            <>
              <Link to="/ownerdashboard" onClick={() => setMenuOpen(false)}>
                📊 Dashboard
              </Link>
              <Link to="/my-restaurants" onClick={() => setMenuOpen(false)}>
                🍽 Restaurants
              </Link>
              <Link to="/my-reviews" onClick={() => setMenuOpen(false)}>
                ⭐ Reviews
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/admindashboard" onClick={() => setMenuOpen(false)}>
                📊 Dashboard
              </Link>
              <Link to="/admin/restaurants" onClick={() => setMenuOpen(false)}>
                🍽 Restaurants
              </Link>
              <Link to="/admin/reservations" onClick={() => setMenuOpen(false)}>
                📅 Reservations
              </Link>
              <Link to="/admin/users" onClick={() => setMenuOpen(false)}>
                👥 Users
              </Link>
              <Link to="/admin/reviews" onClick={() => setMenuOpen(false)}>
                ⭐ Reviews
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
