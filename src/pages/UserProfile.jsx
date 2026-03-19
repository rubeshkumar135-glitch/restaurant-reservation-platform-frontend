import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/users/profile?ts=" + Date.now(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // IMAGE CHANGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);

      if (image) {
        data.append("profileImage", image);
      }

      const res = await API.put("/api/users/update-profile", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Updated ✅");

      setUser(res.data.user);
      setEditMode(false);
      setPreview(null);
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-indigo-900 text-white">
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-indigo-900">
      <div className="rounded-3xl p-6 md:p-8 w-full max-w-md text-center bg-white/10 text-white border border-white/20 backdrop-blur-lg">
        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center mb-5">
          <label className="cursor-pointer group">
            <img
              src={
                preview ||
                user?.profileImage ||
                `https://ui-avatars.com/api/?name=${user?.name}`
              }
              alt="profile"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-80 transition"
            />
            {editMode && (
              <input
                type="file"
                onChange={handleImageChange}
                className="hidden"
              />
            )}
          </label>

          {editMode && (
            <p className="text-xs mt-2 opacity-70">Click image to change</p>
          )}
        </div>

        {/* NAME + EMAIL */}
        {editMode ? (
          <>
            <input
              placeholder="Name"
              className="w-full p-2 mb-3 rounded bg-black/30 border border-white/20 text-white"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              className="w-full p-2 mb-3 rounded bg-black/30 border border-white/20 text-white"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl font-bold">{user.name}</h2>
            <p className="text-sm opacity-70 mb-4">{user.email}</p>
          </>
        )}

        {/* JOIN DATE */}
        <div className="bg-white/10 rounded-xl p-3 mb-4 text-left">
          <p>
            <span className="font-semibold">📅 Joined:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3">
          {editMode ? (
            <>
              <button
                onClick={handleUpdate}
                className="w-full py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
              >
                💾 Save Changes
              </button>

              <button
                onClick={() => {
                  setEditMode(false);
                  setPreview(null);
                }}
                className="w-full py-2 rounded-full bg-gray-500 text-white"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="w-full py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
            >
              ✏️ Edit Profile
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
