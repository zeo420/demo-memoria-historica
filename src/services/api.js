// src/services/api.js - Cliente API para conectar con el backend
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configurar axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================
export const authAPI = {
  register: async (nombre, email, password) => {
    const response = await api.post('/auth/register', { nombre, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// ==================== EVENTOS ====================
export const eventosAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/eventos', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/eventos/${id}`);
    return response.data;
  },

  create: async (eventoData) => {
    const response = await api.post('/eventos', eventoData);
    return response.data;
  },

  update: async (id, eventoData) => {
    const response = await api.put(`/eventos/${id}`, eventoData);
    return response.data;
  }
};

// ==================== TRIVIA ====================
export const triviaAPI = {
  getPreguntas: async (params = {}) => {
    const response = await api.get('/trivia/preguntas', { params });
    return response.data;
  },

  guardarResultado: async (resultadoData) => {
    const response = await api.post('/trivia/resultado', resultadoData);
    return response.data;
  },

  getHistorial: async () => {
    const response = await api.get('/trivia/historial');
    return response.data;
  }
};

// ==================== USUARIO ====================
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  },

  getRanking: async () => {
    const response = await api.get('/user/ranking');
    return response.data;
  },

  getEstadisticas: async () => {
    const response = await api.get('/user/estadisticas');
    return response.data;
  }
};

export default api;