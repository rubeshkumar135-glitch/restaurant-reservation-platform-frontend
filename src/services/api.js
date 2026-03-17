import axios from "axios";

const API = axios.create({
  baseURL: "https://restaurant-reservation-platform-backend.onrender.com"
});

export default API;