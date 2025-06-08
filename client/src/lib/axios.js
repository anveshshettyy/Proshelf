import axios from 'axios';

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api"
  : "/api"; 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosInstance;