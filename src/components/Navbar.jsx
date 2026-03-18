import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [menuOpen, setMenuOpen] = useState(false);

  

  const isActive = (path) =>
    location.pathname === path ? "text-indigo-400" : "";

  return (

    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-gray-900 to-indigo-900 backdrop-blur-xl border-b border-white/10 shadow-lg">

      <div className="max-w-8xl mx-auto px-4 md:px-10 py-8 flex justify-between items-center text-white">

        {/* 🍽 LOGO */}
        <Link
          to="/"
          className="text-2xl md:text-4xl font-bold tracking-wide hover:scale-105 transition"
        >
          🍽 FoodieHub
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">

          <Link
            to="/"
            className={`relative text-xl hover:text-indigo-400 transition ${isActive("/userdashboard")}`}
          >
            Home
          </Link>

          {token && (
            <Link
              to="/my-reservations"
              className={`relative text-xl hover:text-indigo-400 transition ${isActive("/my-reservations")}`}
            >
              My Reservations
            </Link>
          )}

          {token ? (
            
            <Link to="/profile" 
                 className={`relative text-xl hover:text-indigo-400 transition ${isActive("/profile")}`}
             >Profile
            </Link>

            
          ) : (
            <>
              <Link
                to="/login"
                className="px-8 py-2 rounded-full border border-white/30 hover:bg-white/10 text-xl"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-8 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-xl hover:opacity-90 shadow-md"
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

          <Link
            to="/userdashboard"
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

          {token ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full py-2 rounded-full bg-red-500"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-center py-2 border rounded-full"
              >
                Login
              </Link>

              <Link
                to="/"
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