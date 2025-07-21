import React from 'react';
import { Check, X, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !todo.completed;
  };

  return (
    <div className={`p-4 border rounded-lg transition-all duration-200 ${
      todo.completed 
        ? 'bg-gray-50 border-gray-200 opacity-75' 
        : 'bg-white border-gray-300 hover:border-blue-300 hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggle(todo._id)}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              todo.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            {todo.completed && <Check size={12} />}
          </button>
          
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${
              todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {todo.title}
            </h3>
            
            {todo.description && (
              <p className={`mt-1 text-sm ${
                todo.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {todo.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                getPriorityColor(todo.priority)
              }`}>
                {todo.priority}
              </span>
              
              {todo.dueDate && (
                <div className={`flex items-center space-x-1 text-xs ${
                  isOverdue(todo.dueDate) 
                    ? 'text-red-600' 
                    : todo.completed 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                }`}>
                  {isOverdue(todo.dueDate) && <AlertCircle size={12} />}
                  <Calendar size={12} />
                  <span>Due: {formatDate(todo.dueDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(todo)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit todo"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(todo._id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete todo"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
