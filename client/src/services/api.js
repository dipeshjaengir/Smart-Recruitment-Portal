import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    API_URL = 'https://smart-recruitment-portal-h8hb.onrender.com/api';
  } else {
    API_URL = 'http://localhost:5000/api';
  }
}

export const BACKEND_URL = API_URL.replace('/api', '');

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    if (config.url && config.url.startsWith('/') && !config.url.startsWith('/api')) {
      config.url = `/api${config.url}`;
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login?session_expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
