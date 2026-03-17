import { useParams } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

function UploadPhotos() {

  const { id } = useParams();
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("photos", files[i]);
    }

    try {

      const token = localStorage.getItem("token");

      await API.post(`/api/restaurants/upload/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Photos uploaded successfully");

    } catch (error) {
      console.error(error);
    }

  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-6">

      <div className="w-full max-w-xl bg-gray-900 border border-yellow-500 rounded-2xl p-8 shadow-lg">

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 text-center mb-6">
          Upload Restaurant Photos
        </h1>

        {/* Restaurant ID */}
        <p className="text-gray-400 text-sm text-center mb-6">
          Restaurant ID: <span className="text-yellow-400">{id}</span>
        </p>

        {/* Upload Box */}
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-yellow-500 rounded-lg cursor-pointer hover:bg-gray-800 transition">

          <span className="text-yellow-400 font-semibold">
            Click to upload photos
          </span>

          <span className="text-gray-400 text-sm mt-1">
            JPG, PNG allowed
          </span>

          <input
            type="file"
            multiple
            onChange={handleChange}
            className="hidden"
          />

        </label>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="mt-5 text-sm text-gray-300">
            <p className="mb-2 text-yellow-400 font-semibold">
              Selected Files:
            </p>

            <ul className="space-y-1">
              {Array.from(files).map((file, index) => (
                <li key={index} className="truncate">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition"
        >
          Upload Photos
        </button>

      </div>

    </div>

  );
}

export default UploadPhotos;