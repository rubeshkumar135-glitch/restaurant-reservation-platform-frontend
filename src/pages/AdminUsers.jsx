import { useEffect, useState } from "react";
import API from "../services/api";

function AdminUsers() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {

    const token = localStorage.getItem("token");

    const res = await API.get("/api/admin/allusers", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setUsers(res.data);
  };

  return (

    <div className="min-h-screen bg-orange-50 p-4 md:p-8">

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">

        <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-6 text-center">
          👥 All Users
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full border border-gray-200">

            <thead>

              <tr className="bg-orange-500 text-white">

                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>

              </tr>

            </thead>

            <tbody>

              {users.length === 0 ? (

                <tr>
                  <td colSpan="3" className="text-center p-6 text-gray-500">
                    No Users Found
                  </td>
                </tr>

              ) : (

                users.map((user) => (

                  <tr
                    key={user._id}
                    className="border-b hover:bg-orange-100 transition"
                  >

                    <td className="p-3 font-medium">
                      {user.name}
                    </td>

                    <td className="p-3">
                      {user.email}
                    </td>

                    <td className="p-3 capitalize">
                      {user.role}
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

export default AdminUsers;