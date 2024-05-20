import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {}, { withCredentials: true });
        if (response.status === 200) {
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.error('Token refresh error:', err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;