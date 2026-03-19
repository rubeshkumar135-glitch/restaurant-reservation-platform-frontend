import { useEffect, useState } from "react";
import API from "../services/api";

function AdminUsers() {
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/admin/allusers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 THEME
  const pageBg = isAdmin
    ? "bg-orange-50"
    : "bg-gradient-to-br from-black via-gray-900 to-indigo-900";

  const containerBg = isAdmin
    ? "bg-white text-gray-800"
    : "bg-white/10 text-white backdrop-blur border border-white/20";

  const headerBg = isAdmin
    ? "bg-orange-500 text-white"
    : "bg-indigo-600 text-white";

  const rowHover = isAdmin ? "hover:bg-orange-100" : "hover:bg-white/10";

  const textMuted = isAdmin ? "text-gray-500" : "text-gray-300";

  return (
    <div className={`min-h-screen p-4 md:p-8 ${pageBg}`}>
      <div
        className={`max-w-6xl mx-auto shadow-lg rounded-lg p-6 ${containerBg}`}
      >
        <h2
          className={`text-2xl md:text-3xl font-bold mb-6 text-center ${
            isAdmin ? "text-orange-600" : "text-white"
          }`}
        >
          👥 All Users
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            {/* HEADER */}
            <thead>
              <tr className={headerBg}>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center p-6">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-6">
                    No Users Found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className={`border-b transition ${rowHover}`}
                  >
                    {/* NAME */}
                    <td className="p-3 font-medium">{user.name}</td>

                    {/* EMAIL */}
                    <td className={`p-3 ${textMuted}`}>{user.email}</td>

                    {/* ROLE */}
                    <td className="p-3 capitalize font-semibold">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.role === "admin"
                            ? "bg-red-500 text-white"
                            : user.role === "owner"
                              ? "bg-yellow-500 text-black"
                              : "bg-green-500 text-white"
                        }`}
                      >
                        {user.role}
                      </span>
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
