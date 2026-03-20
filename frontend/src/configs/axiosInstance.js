import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://manage-restaurant-eight.vercel.app/",
  withCredentials: true,
});

export default axiosInstance;
