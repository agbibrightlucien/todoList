import axios from 'axios';
import { config, logger, storage } from '../config/environment';
import { getErrorMessage, logError, showDevError } from '../utils/errorHandling.js';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = storage.getItem('token') || localStorage.getItem(config.TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logger.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Handle token expiration and logging
api.interceptors.response.use(
  (response) => {
    logger.debug('API Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    logger.error('API Response Error:', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      // Clear all authentication data
      storage.removeItem('token');
      storage.removeItem('user');
      localStorage.removeItem(config.TOKEN_STORAGE_KEY);
      localStorage.removeItem(config.USER_STORAGE_KEY);
      
      // Redirect to login
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const todoAPI = {
  // Get all todos
  getTodos: async () => {
    try {
      const response = await api.get('/todos');
      return response.data;
    } catch (error) {
      logError('Get Todos', error);
      showDevError('Get Todos', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Get a specific todo
  getTodo: async (id) => {
    try {
      const response = await api.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      logError('Get Todo', error, { id });
      showDevError('Get Todo', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Create a new todo
  createTodo: async (todoData) => {
    try {
      const response = await api.post('/todos', todoData);
      return response.data;
    } catch (error) {
      logError('Create Todo', error, { title: todoData.title });
      showDevError('Create Todo', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Update a todo
  updateTodo: async (id, todoData) => {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Delete a todo
  deleteTodo: async (id) => {
    try {
      await api.delete(`/todos/${id}`);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  // Toggle todo completion
  toggleTodo: async (id) => {
    try {
      const response = await api.patch(`/todos/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error toggling todo:', error);
      throw error;
    }
  },

  // SUBTASK OPERATIONS

  // Add a subtask to a todo
  addSubtask: async (todoId, title) => {
    try {
      const response = await api.post(`/todos/${todoId}/subtasks`, { title });
      return response.data;
    } catch (error) {
      console.error('Error adding subtask:', error);
      throw error;
    }
  },

  // Toggle subtask completion
  toggleSubtask: async (todoId, subtaskId) => {
    try {
      const response = await api.patch(`/todos/${todoId}/subtasks/${subtaskId}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error toggling subtask:', error);
      throw error;
    }
  },

  // Update subtask title
  updateSubtask: async (todoId, subtaskId, title) => {
    try {
      const response = await api.put(`/todos/${todoId}/subtasks/${subtaskId}`, { title });
      return response.data;
    } catch (error) {
      console.error('Error updating subtask:', error);
      throw error;
    }
  },

  // Delete a subtask
  deleteSubtask: async (todoId, subtaskId) => {
    try {
      const response = await api.delete(`/todos/${todoId}/subtasks/${subtaskId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting subtask:', error);
      throw error;
    }
  },

  // Bulk operations on subtasks
  bulkUpdateSubtasks: async (todoId, action, subtaskIds) => {
    try {
      const response = await api.patch(`/todos/${todoId}/subtasks/bulk`, {
        action,
        subtaskIds
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating subtasks:', error);
      throw error;
    }
  },
};

export const authAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      logError('Registration', error, { userData: { email: userData.email, name: userData.name } });
      showDevError('Registration', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      logError('Login', error, { email: credentials.email });
      showDevError('Login', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Get current user info
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      logError('Get User Info', error);
      showDevError('Get User Info', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      logError('Forgot Password', error, { email });
      showDevError('Forgot Password', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      const response = await api.put(`/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      logError('Reset Password', error);
      showDevError('Reset Password', error);
      throw new Error(getErrorMessage(error));
    }
  },
};

export default todoAPI;
