import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Circle, AlertTriangle, Edit, Trash2, Calendar, Target, TrendingUp, Clock, Tag } from 'lucide-react';
import { todoAPI } from '../services/api';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Categories configuration
  const categories = [
    { id: 'work', label: 'Work', icon: '💼' },
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'shopping', label: 'Shopping', icon: '🛒' },
    { id: 'health', label: 'Health', icon: '🏥' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: 'hobbies', label: 'Hobbies', icon: '🎨' },
    { id: 'other', label: 'Other', icon: '📝' }
  ];

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'personal',
    dueDate: ''
  });

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoAPI.getTodos();
      setTodos(data);
    } catch (error) {
      setError('Failed to fetch todos. Make sure the backend server is running.');
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const todoData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate || undefined
      };

      const newTodo = await todoAPI.createTodo(todoData);
      setTodos(prev => [newTodo, ...prev]);
      setFormData({ title: '', description: '', priority: 'medium', category: 'personal', dueDate: '' });
      setShowForm(false);
    } catch (error) {
      setError('Failed to create todo');
      console.error('Error creating todo:', error);
    }
  };

  const handleEditTodo = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const todoData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate || undefined
      };

      const updatedTodo = await todoAPI.updateTodo(editingTodo._id, todoData);
      setTodos(prev => prev.map(todo => 
        todo._id === editingTodo._id ? updatedTodo : todo
      ));
      setEditingTodo(null);
      setFormData({ title: '', description: '', priority: 'medium', category: 'personal', dueDate: '' });
    } catch (error) {
      setError('Failed to update todo');
      console.error('Error updating todo:', error);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const updatedTodo = await todoAPI.toggleTodo(id);
      setTodos(prev => prev.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
    } catch (error) {
      setError('Failed to toggle todo');
      console.error('Error toggling todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;
    
    try {
      await todoAPI.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (error) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', error);
    }
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title || '',
      description: todo.description || '',
      priority: todo.priority || 'medium',
      category: todo.category || 'personal',
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTodo(null);
    setFormData({ title: '', description: '', priority: 'medium', category: 'personal', dueDate: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'completed' && todo.completed) ||
                         (filter === 'active' && !todo.completed);

    const matchesCategory = categoryFilter === 'all' || todo.category === categoryFilter;

    return matchesSearch && matchesFilter && matchesCategory;
  });

  // Get statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  // Get category for display
  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories.find(cat => cat.id === 'other');
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="main-content flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="loading-spinner spinner-lg mx-auto mb-4 text-primary-500"></div>
          <p className="text-gray-600 font-medium">Loading your todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        {/* Welcome Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Your <span className="text-primary-600">Productivity</span> Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your ideas into achievements. Stay organized, focused, and productive with your personal todo manager.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message mb-6 animate-slide-up">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="btn btn-ghost btn-sm"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card card-elevated animate-slide-up">
            <div className="card-content">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">{totalTodos}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-elevated animate-slide-up">
            <div className="card-content">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900">{activeTodos}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-elevated animate-slide-up">
            <div className="card-content">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{completedTodos}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="card mb-8 animate-slide-up">
          <div className="card-content">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary btn-lg flex items-center gap-3"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Task</span>
                </button>
                
                <div className="flex gap-3 flex-wrap">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="input"
                  >
                    <option value="all">All Tasks</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                  
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="input"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input w-full pl-12"
                />
                <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="grid gap-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Circle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filter !== 'all' 
                  ? 'No tasks match your filters' 
                  : 'Ready to get productive?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Create your first task to start organizing your work'}
              </p>
              {!searchTerm && filter === 'all' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary btn-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Task
                </button>
              )}
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div 
                key={todo._id} 
                className={`card todo-item animate-slide-up ${todo.completed ? 'completed' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-content">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleTodo(todo._id)}
                      className="todo-checkbox mt-1"
                    >
                      {todo.completed && <span className="text-white text-xs">✓</span>}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-semibold mb-2 todo-text ${
                        todo.completed ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {todo.title}
                      </h3>
                      
                      {todo.description && (
                        <p className={`text-sm mb-3 ${
                          todo.completed ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {todo.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`badge badge-${todo.priority}`}>
                          {todo.priority}
                        </span>
                        
                        <span className={`badge-category badge-${todo.category || 'other'}`}>
                          {getCategoryInfo(todo.category || 'other').icon} {getCategoryInfo(todo.category || 'other').label}
                        </span>
                        
                        {todo.dueDate && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>Due {formatDate(todo.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(todo)}
                        className="btn btn-ghost btn-icon"
                        title="Edit task"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo._id)}
                        className="btn btn-ghost btn-icon text-danger-500 hover:text-danger-600 hover:bg-danger-50"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Todo Form Modal */}
        {(showForm || editingTodo) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50 animate-fade-in">
            <div className="card card-elevated w-full max-w-md animate-bounce-in">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingTodo ? 'Edit Task' : 'Create New Task'}
                  </h2>
                  <button
                    onClick={handleCancelForm}
                    className="btn btn-ghost btn-icon"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="card-content">
                <form onSubmit={editingTodo ? handleEditTodo : handleAddTodo} className="space-y-6">
                  <div className="input-group">
                    <label className="input-label">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="input"
                      placeholder="What needs to be done?"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="input"
                      placeholder="Add more details about this task..."
                      style={{resize: 'vertical'}}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group">
                      <label className="input-label">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label className="input-label">
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="input"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="btn btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex-1"
                    >
                      {editingTodo ? 'Update Task' : 'Create Task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoApp;
