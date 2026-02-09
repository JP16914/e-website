import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 redirect if needed
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // redirect logic if needed, but usually handled by components
    }
    return Promise.reject(error);
  }
);
