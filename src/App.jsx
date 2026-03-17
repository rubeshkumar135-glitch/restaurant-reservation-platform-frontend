import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import UserDashboard from "./pages/UserDashboard";

import AdminRestaurants from "./pages/AdminRestaurants";
import AdminReviews from "./pages/AdminReviews";
import AdminUsers from "./pages/AdminUsers";
import AdminReservations from "./pages/AdminReservations";

import CreateRestaurant from "./pages/CreateRestaurant";
import MyRestaurants from "./pages/MyRestaurants";
import UpdateRestaurant from "./pages/UpdateRestaurant";
import UploadPhotos from "./pages/uploadPhotos";

import RestaurantReviews from "./pages/RestaurantReviews";
import CreateReview from "./pages/CreateReview";
import UpdateReview from "./pages/UpdateReview";
import OwnerResponse from "./pages/OwnerResponse";

import CreateReservation from "./pages/CreateReservation";
import MyReservations from "./pages/MyReservation";
import UpdateReservation from "./pages/UpdateReservation";

import Success from "./pages/Successs";
import Cancel from "./pages/Cancel";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/ownerdashboard" element={<OwnerDashboard />} />
        <Route path="/userdashboard" element={<UserDashboard />} />

        <Route path="/admin/restaurants" element={<AdminRestaurants />} />
        <Route path="/admin/reservations" element={<AdminReservations />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/users" element={<AdminUsers />} /> 

        <Route path="/create-restaurant" element={<CreateRestaurant />} />
        <Route path="/my-restaurants" element={<MyRestaurants />} />
        <Route path="/update-restaurant/:id" element={<UpdateRestaurant />} />
        <Route path="/upload-photos/:id" element={<UploadPhotos />} /> 
        
        <Route path="/reviews/:restaurantId" element={<RestaurantReviews />} />
        <Route path="/create-review/:restaurantId" element={<CreateReview />} />
        <Route path="/update-review/:id" element={<UpdateReview />} />
        <Route path="/owner-response/:reviewId" element={<OwnerResponse />} />

        <Route path="/create-reservation/:restaurantId" element={<CreateReservation />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/update-reservation/:id" element={<UpdateReservation />} />
      
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />

      </Routes>
    </Router>
  );
}

export default App;