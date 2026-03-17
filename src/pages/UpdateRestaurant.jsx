import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function UpdateRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", description: "", address: "", city: "", state: "",
    zipCode: "", phone: "", email: "", cuisineTypes: [],
    priceRange: "", photos: [], capacity: ""
  });

  const [existingPhotos, setExistingPhotos] = useState([]); // To show what's currently there
  const [previews, setPreviews] = useState([]); // For new uploads
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRestaurant();
    // Cleanup previews on unmount
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const res = await API.get(`/api/restaurants/${id}`);
      const r = res.data;

      setFormData({
        ...r,
        photos: [] // Reset photos state to hold only NEW files
      });
      setExistingPhotos(r.photos || []); // Store the URLs from Cloudinary
    } catch (err) {
      setError("Failed to load restaurant details");
    }
  };

  const handleChange = (e) => {
    const { name, value, options, multiple } = e.target;
    if (multiple) {
      const selected = Array.from(options).filter(o => o.selected).map(o => o.value);
      setFormData(prev => ({ ...prev, [name]: selected }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, photos: files }));

    // Generate previews for new files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      
      // Append all fields except photos (handled separately)
      Object.keys(formData).forEach((key) => {
        if (key === "cuisineTypes") {
          formData.cuisineTypes.forEach(c => form.append("cuisineTypes", c));
        } else if (key !== "photos") {
          form.append(key, formData[key]);
        }
      });

      // Only append new photos if the user actually selected some
      if (formData.photos.length > 0) {
        formData.photos.forEach(file => form.append("photos", file));
      }

      await API.put(`/api/restaurants/update/${id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Restaurant Updated Successfully!");
      navigate("/ownerdashboard"); // Redirect after success
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-10 px-4 flex justify-center">
      <div className="w-full max-w-6xl bg-gray-900 rounded-2xl border border-yellow-500 shadow-xl p-10">
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-10">Update Restaurant</h1>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Restaurant Info */}
          <section>
            <h2 className="text-yellow-400 text-xl font-semibold mb-4 border-b border-gray-800 pb-2">Basic Info</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <input className="inputStyle" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
              <input className="inputStyle" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
              <select name="cuisineTypes" className="inputStyle h-32" multiple onChange={handleChange} value={formData.cuisineTypes}>
                <option value="South Indian">South Indian</option>
                <option value="North Indian">North Indian</option>
                <option value="Chinese">Chinese</option>
                <option value="Italian">Italian</option>
              </select>
              <select className="inputStyle" name="priceRange" value={formData.priceRange} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </section>

          {/* Photos Section */}
          <section>
            <h2 className="text-yellow-400 text-xl font-semibold mb-4 border-b border-gray-800 pb-2">Photos</h2>
            
            {/* Existing Photos */}
            {existingPhotos.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Current Photos:</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {existingPhotos.map((url, i) => (
                    <img key={i} src={url} className="w-20 h-20 object-cover rounded border border-gray-700" alt="Current" />
                  ))}
                </div>
              </div>
            )}

            <label className="block text-gray-400 text-sm mb-2">Upload New Photos (Optional):</label>
            <input className="inputStyle" type="file" multiple onChange={handleFileChange} accept="image/*" />
            
            {/* New Previews */}
            {previews.length > 0 && (
              <div className="flex gap-2 mt-4">
                {previews.map((url, i) => (
                  <img key={i} src={url} className="w-20 h-20 object-cover rounded border border-yellow-500" alt="New Preview" />
                ))}
              </div>
            )}
          </section>

          <button type="submit" disabled={loading} className={`w-full font-semibold py-3 rounded-lg transition text-lg ${loading ? "bg-gray-700" : "bg-yellow-500 hover:bg-yellow-600 text-black"}`}>
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateRestaurant;