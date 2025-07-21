import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Circle, AlertTriangle } from 'lucide-react';
import { todoAPI } from './services/api';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
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
        dueDate: formData.dueDate || undefined
      };

      const newTodo = await todoAPI.createTodo(todoData);
      setTodos(prev => [newTodo, ...prev]);
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
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
        dueDate: formData.dueDate || undefined
      };

      const updatedTodo = await todoAPI.updateTodo(editingTodo._id, todoData);
      setTodos(prev => prev.map(todo => 
        todo._id === editingTodo._id ? updatedTodo : todo
      ));
      setEditingTodo(null);
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
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
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTodo(null);
    setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
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

    return matchesSearch && matchesFilter;
  });

  // Get statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-lg h-12 w-12 border-b-2 mx-auto" style={{borderColor: '#2563eb'}}></div>
          <p className="mt-4 text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo List</h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 card" style={{backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#b91c1c'}}>
            <div className="flex items-center space-x-2">
              <AlertTriangle size={20} />
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                style={{marginLeft: 'auto', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center space-x-2">
              <Circle className="text-blue-600" size={20} />
              <div>
                <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Total</p>
                <p className="text-2xl font-semibold text-gray-900">{totalTodos}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center space-x-2">
              <Circle style={{color: '#d97706'}} size={20} />
              <div>
                <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Active</p>
                <p className="text-2xl font-semibold text-gray-900">{activeTodos}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={20} />
              <div>
                <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{completedTodos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="card mb-6">
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary flex items-center justify-center space-x-2"
              style={{width: 'fit-content'}}
            >
              <Plus size={20} />
              <span>Add New Todo</span>
            </button>

            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
              <input
                type="text"
                placeholder="Search todos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
                style={{flex: 1, minWidth: '200px'}}
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input"
                style={{width: 'auto'}}
              >
                <option value="all">All Todos</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
          {filteredTodos.length === 0 ? (
            <div className="text-center" style={{padding: '3rem 0'}}>
              <Circle style={{margin: '0 auto 1rem', color: '#9ca3af'}} size={48} />
              <p style={{color: '#6b7280', fontSize: '1.125rem'}}>
                {searchTerm || filter !== 'all' 
                  ? 'No todos match your filters' 
                  : 'No todos yet. Add one to get started!'}
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div 
                key={todo._id} 
                className="card transition-all"
                style={{
                  opacity: todo.completed ? 0.75 : 1,
                  backgroundColor: todo.completed ? '#f9fafb' : 'white'
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2" style={{flex: 1}}>
                    <button
                      onClick={() => handleToggleTodo(todo._id)}
                      style={{
                        marginTop: '0.25rem',
                        width: '1.25rem',
                        height: '1.25rem',
                        borderRadius: '0.25rem',
                        border: `2px solid ${todo.completed ? '#16a34a' : '#d1d5db'}`,
                        backgroundColor: todo.completed ? '#16a34a' : 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {todo.completed && '✓'}
                    </button>
                    
                    <div style={{flex: 1}}>
                      <h3 className={`text-lg font-medium ${todo.completed ? 'text-gray-500' : 'text-gray-900'}`}
                          style={{textDecoration: todo.completed ? 'line-through' : 'none'}}>
                        {todo.title}
                      </h3>
                      
                      {todo.description && (
                        <p className="mt-1" style={{
                          fontSize: '0.875rem',
                          color: todo.completed ? '#9ca3af' : '#6b7280'
                        }}>
                          {todo.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-2">
                        <span 
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            borderRadius: '9999px',
                            border: `1px solid ${getPriorityColor(todo.priority)}`,
                            color: getPriorityColor(todo.priority),
                            backgroundColor: `${getPriorityColor(todo.priority)}15`
                          }}
                        >
                          {todo.priority}
                        </span>
                        
                        {todo.dueDate && (
                          <span style={{
                            fontSize: '0.75rem',
                            color: todo.completed ? '#9ca3af' : '#6b7280'
                          }}>
                            Due: {formatDate(todo.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2" style={{marginLeft: '1rem'}}>
                    <button
                      onClick={() => handleEditClick(todo)}
                      style={{
                        padding: '0.25rem',
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer'
                      }}
                      title="Edit todo"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      style={{
                        padding: '0.25rem',
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer'
                      }}
                      title="Delete todo"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Todo Form Modal */}
        {(showForm || editingTodo) && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 50
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '28rem',
              width: '100%'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.5rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingTodo ? 'Edit Todo' : 'Add New Todo'}
                </h2>
                <button
                  onClick={handleCancelForm}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: '#9ca3af',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={editingTodo ? handleEditTodo : handleAddTodo} style={{padding: '1.5rem'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <div>
                    <label htmlFor="title" style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.25rem'
                    }}>
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter todo title..."
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label htmlFor="description" style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.25rem'
                    }}>
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="input"
                      placeholder="Enter description (optional)..."
                      style={{resize: 'vertical'}}
                    />
                  </div>

                  <div>
                    <label htmlFor="priority" style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.25rem'
                    }}>
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dueDate" style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.25rem'
                    }}>
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.75rem',
                    paddingTop: '1rem'
                  }}>
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {editingTodo ? 'Update Todo' : 'Add Todo'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
