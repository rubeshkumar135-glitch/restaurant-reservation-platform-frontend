import { Link } from "react-router-dom";

function OwnerDashboard() {

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold text-yellow-400 mb-10 text-center">
        Owner Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <Link
          to="/create-restaurant"
          className="bg-yellow-500 hover:bg-yellow-600 text-black p-8 rounded-xl text-center font-semibold text-lg shadow-lg"
        >
          Create Restaurant
        </Link>

        <Link
          to="/my-restaurants"
          className="bg-yellow-500 hover:bg-yellow-600 text-black p-8 rounded-xl text-center font-semibold text-lg shadow-lg"
        >
          My Restaurants
        </Link>

      </div>

    </div>
  );
}

export default OwnerDashboard;