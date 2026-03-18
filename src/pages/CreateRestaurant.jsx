import { useState } from "react";
import API from "../services/api.js";

function CreateRestaurant() {

const [previewImages, setPreviewImages] = useState([]);

const [formData, setFormData] = useState({
  name:"", description:"", address:"", city:"", state:"",
  zipCode:"", phone:"", email:"", cuisineTypes:[],
  priceRange:"", photos:[], capacity:""
});

const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

/* INPUT CHANGE */
const handleChange = (e) => {
  const { name, value, options, multiple } = e.target;

  if (multiple) {
    const selected = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);

    setFormData(prev => ({ ...prev, [name]: selected }));
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
};

/* FILE CHANGE + PREVIEW */
const handleFileChange = (e) => {
  const files = Array.from(e.target.files);

  setFormData(prev => ({ ...prev, photos: files }));

  const previews = files.map(file => URL.createObjectURL(file));
  setPreviewImages(previews);
};

/* SUBMIT */
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if(!formData.name){
    return setError("Restaurant name is required");
  }

  try {
    setLoading(true);

    const form = new FormData();

    Object.keys(formData).forEach((key)=>{
      if(key === "cuisineTypes"){
        formData.cuisineTypes.forEach(c => form.append("cuisineTypes",c));
      } else if(key === "photos"){
        formData.photos.forEach(p => form.append("photos",p));
      } else {
        form.append(key,formData[key]);
      }
    });

    const token = localStorage.getItem("token");

    await API.post("/api/restaurants/create",form,{
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"multipart/form-data"
      }
    });

    alert("Restaurant Created Successfully");

    setFormData({
      name:"", description:"", address:"", city:"", state:"",
      zipCode:"", phone:"", email:"", cuisineTypes:[],
      priceRange:"", photos:[], capacity:""
    });

    setPreviewImages([]);

  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

return (
<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-10 px-4 flex justify-center">

<div className="w-full max-w-6xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12">

<h1 className="text-3xl md:text-4xl font-bold text-yellow-400 text-center mb-10">
🍽️ Create Restaurant
</h1>

{error && (
<div className="bg-red-500 text-white p-3 rounded mb-6 text-center">
{error}
</div>
)}

<form onSubmit={handleSubmit} className="space-y-10">

{/* SECTION CARD */}
<div className="bg-white/5 p-6 rounded-xl border border-white/10">
<h2 className="text-yellow-400 text-lg font-semibold mb-4">Restaurant Info</h2>

<div className="grid md:grid-cols-2 gap-5">

<input className="inputStyle" name="name" value={formData.name} placeholder="Restaurant Name" onChange={handleChange}/>
<input className="inputStyle" name="description" value={formData.description} placeholder="Description" onChange={handleChange}/>

<select name="cuisineTypes" className="inputStyle" multiple onChange={handleChange}>
<option>South Indian</option>
<option>North Indian</option>
<option>Chinese</option>
<option>Italian</option>
</select>

<select className="inputStyle" name="priceRange" value={formData.priceRange} onChange={handleChange}>
<option value="">Price Range</option>
<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>
</select>

<input className="inputStyle" type="number" name="capacity" value={formData.capacity} placeholder="Capacity" onChange={handleChange}/>

</div>
</div>

{/* LOCATION */}
<div className="bg-white/5 p-6 rounded-xl border border-white/10">
<h2 className="text-yellow-400 text-lg font-semibold mb-4">Location</h2>

<div className="grid md:grid-cols-2 gap-5">
<input className="inputStyle" name="address" value={formData.address} placeholder="Address" onChange={handleChange}/>
<input className="inputStyle" name="city" value={formData.city} placeholder="City" onChange={handleChange}/>
<input className="inputStyle" name="state" value={formData.state} placeholder="State" onChange={handleChange}/>
<input className="inputStyle" name="zipCode" value={formData.zipCode} placeholder="Zip Code" onChange={handleChange}/>
</div>
</div>

{/* CONTACT */}
<div className="bg-white/5 p-6 rounded-xl border border-white/10">
<h2 className="text-yellow-400 text-lg font-semibold mb-4">Contact</h2>

<div className="grid md:grid-cols-2 gap-5">
<input className="inputStyle" name="phone" value={formData.phone} placeholder="Phone" onChange={handleChange}/>
<input className="inputStyle" name="email" value={formData.email} placeholder="Email" onChange={handleChange}/>
</div>
</div>

{/* PHOTOS */}
<div className="bg-white/5 p-6 rounded-xl border border-white/10">
<h2 className="text-yellow-400 text-lg font-semibold mb-4">Photos</h2>

<input className="inputStyle" type="file" multiple onChange={handleFileChange}/>

{/* Preview */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
{previewImages.map((img, i) => (
  <img key={i} src={img} className="h-24 w-full object-cover rounded-lg border border-white/20"/>
))}
</div>

</div>

{/* BUTTON */}
<button
type="submit"
disabled={loading}
className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl text-lg transition-all duration-300 hover:scale-105"
>
{loading ? "Creating..." : "Create Restaurant"}
</button>

</form>

</div>
</div>
);
}

export default CreateRestaurant;