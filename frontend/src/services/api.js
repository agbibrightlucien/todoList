import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
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

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
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
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Get a specific todo
  getTodo: async (id) => {
    try {
      const response = await api.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching todo:', error);
      throw error;
    }
  },

  // Create a new todo
  createTodo: async (todoData) => {
    try {
      const response = await api.post('/todos', todoData);
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
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
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Get current user info
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      const response = await api.put(`/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },
};

export default todoAPI;
