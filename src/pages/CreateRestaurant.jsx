import { useState } from "react";
import API from "../services/api.js";

function CreateRestaurant() {

const [formData, setFormData] = useState({
  name:"",
  description:"",
  address:"",
  city:"",
  state:"",
  zipCode:"",
  phone:"",
  email:"",
  cuisineTypes:[],
  priceRange:"",
  photos:[],
  capacity:""
});

const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

/* ---------------- INPUT CHANGE ---------------- */

const handleChange = (e) => {

  const { name, value, options, multiple } = e.target;

  if (multiple) {
    const selected = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);

    setFormData(prev => ({
      ...prev,
      [name]: selected
    }));

  } else {

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  }
};


/* ---------------- FILE CHANGE ---------------- */

const handleFileChange = (e) => {

  const files = Array.from(e.target.files);

  setFormData(prev => ({
    ...prev,
    photos: files
  }));

};


/* ---------------- FORM SUBMIT ---------------- */

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
        formData.cuisineTypes.forEach(cuisine=>{
          form.append("cuisineTypes",cuisine);
        });

      }else if(key === "photos"){
        formData.photos.forEach(photo=>{
          form.append("photos",photo);
        });

      }else{
        form.append(key,formData[key]);
      }

    });

    const token = localStorage.getItem("token");

    const res = await API.post("/api/restaurants/create",form,{
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"multipart/form-data"
      }
    });

    alert("Restaurant Created Successfully");

    console.log(res.data);

    /* RESET FORM */

    setFormData({
      name:"",
      description:"",
      address:"",
      city:"",
      state:"",
      zipCode:"",
      phone:"",
      email:"",
      cuisineTypes:[],
      priceRange:"",
      photos:[],
      capacity:""
    });

  } catch (err) {

    console.error("FULL ERROR:",err);

    setError(err.response?.data?.message || "Something went wrong");

  } finally {

    setLoading(false);

  }

};


/* ---------------- UI ---------------- */

return (

<div className="min-h-screen bg-black py-10 px-4 flex justify-center">

<div className="w-full max-w-6xl bg-gray-900 rounded-2xl border border-yellow-500 shadow-xl p-10">

<h1 className="text-4xl font-bold text-yellow-400 text-center mb-10">
Create Restaurant
</h1>

{error && (
<div className="bg-red-500 text-white p-3 rounded mb-6 text-center">
{error}
</div>
)}

<form onSubmit={handleSubmit} className="space-y-10">

{/* Restaurant Info */}

<div>

<h2 className="text-yellow-400 text-xl font-semibold mb-4">
Restaurant Information
</h2>

<div className="grid md:grid-cols-2 gap-5">

<input
className="inputStyle"
name="name"
value={formData.name}
placeholder="Restaurant Name"
onChange={handleChange}
/>

<input
className="inputStyle"
name="description"
value={formData.description}
placeholder="Description"
onChange={handleChange}
/>

<select
name="cuisineTypes"
className="inputStyle"
multiple
onChange={handleChange}
>

<option value="South Indian">South Indian</option>
<option value="North Indian">North Indian</option>
<option value="Chinese">Chinese</option>
<option value="Italian">Italian</option>

</select>

<select
className="inputStyle"
name="priceRange"
value={formData.priceRange}
onChange={handleChange}
>

<option value="">Select Price Range</option>
<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>

</select>

<input
className="inputStyle"
type="number"
name="capacity"
value={formData.capacity}
placeholder="Restaurant Capacity"
onChange={handleChange}
/>

</div>

</div>


{/* Location */}

<div>

<h2 className="text-yellow-400 text-xl font-semibold mb-4">
Location Details
</h2>

<div className="grid md:grid-cols-2 gap-5">

<input
className="inputStyle"
name="address"
value={formData.address}
placeholder="Address"
onChange={handleChange}
/>

<input
className="inputStyle"
name="city"
value={formData.city}
placeholder="City"
onChange={handleChange}
/>

<input
className="inputStyle"
name="state"
value={formData.state}
placeholder="State"
onChange={handleChange}
/>

<input
className="inputStyle"
name="zipCode"
value={formData.zipCode}
placeholder="Zip Code"
onChange={handleChange}
/>

</div>

</div>


{/* Contact */}

<div>

<h2 className="text-yellow-400 text-xl font-semibold mb-4">
Contact Information
</h2>

<div className="grid md:grid-cols-2 gap-5">

<input
className="inputStyle"
name="phone"
value={formData.phone}
placeholder="Phone Number"
onChange={handleChange}
/>

<input
className="inputStyle"
name="email"
value={formData.email}
placeholder="Email Address"
onChange={handleChange}
/>

</div>

</div>


{/* Photos */}

<div>

<h2 className="text-yellow-400 text-xl font-semibold mb-4">
Restaurant Photos
</h2>

<input
className="inputStyle"
type="file"
name="photos"
multiple
onChange={handleFileChange}
/>

</div>


{/* Button */}

<button
type="submit"
disabled={loading}
className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition text-lg"
>

{loading ? "Creating..." : "Create Restaurant"}

</button>

</form>

</div>

</div>

);

}

export default CreateRestaurant;