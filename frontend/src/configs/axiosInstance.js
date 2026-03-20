import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://manage-restaurant-94p4.onrender.com",
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export default axiosInstance;
