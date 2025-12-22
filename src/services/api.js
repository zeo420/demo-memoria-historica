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
  },

  getMapa: async (params = {}) => {
    const response = await api.get('/eventos/mapa', { params });
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
  },

  getTorneos: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? 
        `${API_URL}/torneos?${queryString}` : 
        `${API_URL}/torneos`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener torneos:', error);
      throw error;
    }
  },
  
  crearTorneo: async (torneoData) => {
    try {
      const response = await fetch(`${API_URL}/torneos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(torneoData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al crear torneo:', error);
      throw error;
    }
  },
  
  unirseTorneo: async (torneoId, usuarioId, nombre = '', codigoAcceso = '') => {
    try {
      const response = await fetch(`${API_URL}/torneos/${torneoId}/unirse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ usuarioId, nombre, codigoAcceso }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al unirse al torneo:', error);
      throw error;
    }
  },
  
  abandonarTorneo: async (torneoId, usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/torneos/${torneoId}/abandonar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ usuarioId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al abandonar torneo:', error);
      throw error;
    }
  },
  
  getLeaderboard: async (torneoId) => {
    try {
      const response = await fetch(`${API_URL}/torneos/${torneoId}/leaderboard`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener leaderboard:', error);
      throw error;
    }
  },
  
  registrarResultadoTorneo: async (torneoId, resultadoData) => {
    try {
      const response = await fetch(`${API_URL}/torneos/${torneoId}/registrar-resultado`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(resultadoData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al registrar resultado:', error);
      throw error;
    }
  },
  
  getMisTorneos: async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/torneos/usuario/${usuarioId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener mis torneos:', error);
      throw error;
    }
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

// ==================== VIDEOS ====================
export const videosAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/videos', { params });
    return response.data;
  },

  registrarVista: async (videoId) => {
    const response = await api.post(`/videos/${videoId}/vista`);
    return response.data;
  },

  toggleLike: async (videoId) => {
    const response = await api.post(`/videos/${videoId}/like`);
    return response.data;
  }
};

// ==================== MAPAS ====================
export const mapasAPI = {
  getEventosMapa: async (params = {}) => {
    const response = await api.get('/eventos/mapa', { params });
    return response.data;
  }
};

// ==================== PERSONAJES ====================
export const personajesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/personajes', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/personajes/${id}`);
    return response.data;
  }
};

// ==================== NARRATIVAS ====================
export const narrativasAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/narrativas', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/narrativas/${id}`);
    return response.data;
  },

  actualizarProgreso: async (id, capituloCompletado) => {
    const response = await api.post(`/narrativas/${id}/progreso`, { capituloCompletado });
    return response.data;
  }
};

// ==================== PODCASTS ====================
export const podcastsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/podcasts', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/podcasts/${id}`);
    return response.data;
  },

  registrarEscucha: async (id) => {
    const response = await api.post(`/podcasts/${id}/escuchar`);
    return response.data;
  },

  toggleLike: async (id) => {
    const response = await api.post(`/podcasts/${id}/like`);
    return response.data;
  },

  agregarComentario: async (id, texto) => {
    const response = await api.post(`/podcasts/${id}/comentario`, { texto });
    return response.data;
  }
};

export default api;