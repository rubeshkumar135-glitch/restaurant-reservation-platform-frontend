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

  // ✅ FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setFormData({
        name: res.data.name,
        email: res.data.email,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ IMAGE CHANGE (PREVIEW)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ UPDATE PROFILE
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (image) data.append("image", image);

      await API.put("/api/users/update-profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setEditMode(false);
      setPreview(null);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user)
    return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-indigo-900 p-4">
      
  <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md text-center text-white">

    {/* PROFILE IMAGE */}
    <div className="flex flex-col items-center mb-4">
      <img
        src={preview || user.profileImage || "https://via.placeholder.com/120"}
        className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover mb-2"
      />

      {editMode && (
        <input
          type="file"
          onChange={handleImageChange}
          className="text-sm pl-16 text-gray-300"
        />
      )}
    </div>

    {/* NAME */}
    {editMode ? (
      <input
        className="w-full p-2 mb-3 rounded bg-black/30 text-white border border-white/20"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
      />
    ) : (
      <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
    )}

    {/* EMAIL */}
    {editMode ? (
      <input
        className="w-full p-2 mb-3 rounded bg-black/30 text-white border border-white/20"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
      />
    ) : (
      <p className="text-sm opacity-80 mb-4">{user.email}</p>
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
            className="w-full py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 transition font-semibold"
          >
            💾 Save Changes
          </button>

          <button
            onClick={() => {
              setEditMode(false);
              setPreview(null);
            }}
            className="w-full py-2 rounded-full bg-gray-600"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="w-full py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 font-semibold transition"
        >
          ✏️ Edit Profile
        </button>
      )}

      <button
        onClick={handleLogout}
        className="w-full py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 font-semibold shadow-lg transition"
      >
        🚪 Logout
      </button>
    </div>
  </div>
</div>
  );
}

export default UserProfile;