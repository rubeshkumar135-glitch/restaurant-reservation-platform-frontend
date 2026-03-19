import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function UpdateRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    cuisineTypes: [],
    priceRange: "",
    photos: [],
    capacity: "",
  });

  const [existingPhotos, setExistingPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRestaurant();
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const res = await API.get(`/api/restaurants/${id}`);
      const r = res.data;

      setFormData({
        name: r?.name ?? "",
        description: r?.description ?? "",
        address: r?.location?.address ?? "",
        city: r?.location?.city ?? "",
        state: r?.location?.state ?? "",
        zipCode: r?.location?.zipCode ?? "",
        phone: r?.phone ?? "",
        email: r?.email ?? "",
        cuisineTypes: Array.isArray(r?.cuisineTypes) ? r.cuisineTypes : [],
        priceRange: r?.priceRange ?? "",
        capacity: r?.capacity ?? "",
        photos: [],
      });

      setExistingPhotos(Array.isArray(r?.photos) ? r.photos : []);
    } catch {
      setError("Failed to load restaurant details");
    }
  };

  const handleChange = (e) => {
    const { name, value, options, multiple } = e.target;

    if (multiple) {
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);

      setFormData((prev) => ({ ...prev, [name]: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setFormData((prev) => ({ ...prev, photos: files }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "cuisineTypes") {
          formData.cuisineTypes.forEach((c) => form.append("cuisineTypes", c));
        } else if (key !== "photos") {
          form.append(key, formData[key]);
        }
      });

      if (formData.photos.length > 0) {
        formData.photos.forEach((file) => form.append("photos", file));
      }

      await API.put(`/api/restaurants/update/${id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Restaurant Updated Successfully! ✅");
      navigate("/ownerdashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 bg-gradient-to-br from-black via-gray-900 to-indigo-900 text-white flex flex-col lg:flex-row">
      {/* LEFT - IMAGES */}
      <div className="lg:w-1/2 p-6">
        <h2 className="text-2xl font-bold text-indigo-400  mb-4">
          Restaurant Preview
        </h2>

        <p className="text-gray-400 text-sm mb-3">
          {existingPhotos.length + previews.length} Images
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {existingPhotos.length === 0 && previews.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10 border border-dashed border-white/20 rounded-xl">
              No images uploaded 📷
            </div>
          )}

          {existingPhotos.map((url, i) => (
            <img
              key={i}
              src={url}
              className="w-full h-38 object-cover rounded-xl border border-white/20"
            />
          ))}

          {previews.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                className="w-full h-32 object-cover rounded-xl border-2 border-indigo-400"
              />

              <button
                type="button"
                onClick={() => {
                  const newPreviews = previews.filter(
                    (_, index) => index !== i,
                  );
                  const newFiles = formData.photos.filter(
                    (_, index) => index !== i,
                  );

                  setPreviews(newPreviews);
                  setFormData((prev) => ({ ...prev, photos: newFiles }));
                }}
                className="absolute top-1 right-1 bg-red-500 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT - FORM */}
      <div className="lg:w-1/2 flex justify-center items-start p-6">
        <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-indigo-400 mb-6 text-center">
            Edit Restaurant
          </h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Restaurant Name"
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3"
            />

            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="bg-black/30 border border-white/20 rounded-lg px-4 py-3"
              />
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="bg-black/30 border border-white/20 rounded-lg px-4 py-3"
              />
            </div>

            <select
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3"
            >
              <option value="">Price Range</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              name="cuisineTypes"
              multiple
              value={formData.cuisineTypes}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 h-32"
            >
              <option>South Indian</option>
              <option>North Indian</option>
              <option>Chinese</option>
              <option>Italian</option>
            </select>

            <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-sm">Drag & drop images</p>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="mt-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white ${
                loading ? "bg-gray-600" : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {loading ? "Updating..." : "Save Changes 🚀"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateRestaurant;
