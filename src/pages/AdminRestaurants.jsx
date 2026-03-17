import { useEffect, useState } from "react";
import API from "../services/api";

function AdminRestaurants() {

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {

    const token = localStorage.getItem("token");

    const res = await API.get("/api/admin/allrestaurants", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setRestaurants(res.data);
  };

  const deleteRestaurant = async (id) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this restaurant?");

    if (!confirmDelete) return;

    try {

      const token = localStorage.getItem("token");

      await API.delete(`/api/admin/deleterestaurant/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchRestaurants();

    } catch (err) {
      console.log(err);
    }
  };

  return (

    <div className="min-h-screen bg-orange-50 p-4 md:p-8">

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">

        <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-6 text-center">
          🍽️ All Restaurants
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full border border-gray-200">

            <thead>

              <tr className="bg-orange-500 text-white">

                <th className="p-3 text-left">Restaurant Name</th>
                <th className="p-3 text-left">Owner</th>
                <th className="p-3 text-center">Action</th>

              </tr>

            </thead>

            <tbody>

              {restaurants.length === 0 ? (

                <tr>
                  <td colSpan="3" className="text-center p-6 text-gray-500">
                    No Restaurants Found
                  </td>
                </tr>

              ) : (

                restaurants.map((r) => (

                  <tr
                    key={r._id}
                    className="border-b hover:bg-orange-100 transition"
                  >

                    <td className="p-3 font-medium">
                      {r.name}
                    </td>

                    <td className="p-3">
                      {r.owner?.name || "Unknown"}
                    </td>

                    <td className="p-3 text-center">

                      <button
                        onClick={() => deleteRestaurant(r._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}

export default AdminRestaurants;