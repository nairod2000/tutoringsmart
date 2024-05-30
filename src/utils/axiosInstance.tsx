// src/services/api.ts
import axios from 'axios';
import { getCurrentUser, logout } from '../services/authServices';

const API_URL = 'http://localhost:8000/';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const user = getCurrentUser();
        const verifyResponse = await axios.post(API_URL + 'api/auth/token/verify/', {
          token: user.token,
        });
        if (verifyResponse.status !== 200) {
          const refreshResponse = await axios.post(API_URL + 'api/auth/token/refresh/', {
            refresh: user.refreshToken,
          });
          if (refreshResponse.status === 200) {
            const newUser = { ...user, token: refreshResponse.data.access };
            localStorage.setItem('user', JSON.stringify(newUser));
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${refreshResponse.data.access}`;
            originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.access}`;
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
