// src/lib/axios.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // ✅ Ensures cookies are sent/received
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Handle 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
