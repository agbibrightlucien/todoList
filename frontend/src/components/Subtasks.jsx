import React, { useState } from 'react';
import { todoAPI } from '../services/api';

const Subtasks = ({ todo, onTodoUpdate, isExpanded = false }) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [selectedSubtasks, setSelectedSubtasks] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    try {
      const updatedTodo = await todoAPI.addSubtask(todo._id, newSubtaskTitle.trim());
      onTodoUpdate(updatedTodo);
      setNewSubtaskTitle('');
      setIsAddingSubtask(false);
    } catch (error) {
      console.error('Error adding subtask:', error);
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      const updatedTodo = await todoAPI.toggleSubtask(todo._id, subtaskId);
      onTodoUpdate(updatedTodo);
    } catch (error) {
      console.error('Error toggling subtask:', error);
    }
  };

  const handleUpdateSubtask = async (subtaskId, title) => {
    if (!title.trim()) return;

    try {
      const updatedTodo = await todoAPI.updateSubtask(todo._id, subtaskId, title.trim());
      onTodoUpdate(updatedTodo);
      setEditingSubtaskId(null);
      setEditingTitle('');
    } catch (error) {
      console.error('Error updating subtask:', error);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      const updatedTodo = await todoAPI.deleteSubtask(todo._id, subtaskId);
      onTodoUpdate(updatedTodo);
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
  };

  const handleSubtaskSelection = (subtaskId) => {
    const newSelected = new Set(selectedSubtasks);
    if (newSelected.has(subtaskId)) {
      newSelected.delete(subtaskId);
    } else {
      newSelected.add(subtaskId);
    }
    setSelectedSubtasks(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleBulkAction = async (action) => {
    if (selectedSubtasks.size === 0) return;

    try {
      const subtaskIds = Array.from(selectedSubtasks);
      const updatedTodo = await todoAPI.bulkUpdateSubtasks(todo._id, action, subtaskIds);
      onTodoUpdate(updatedTodo);
      setSelectedSubtasks(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const startEditingSubtask = (subtask) => {
    setEditingSubtaskId(subtask._id);
    setEditingTitle(subtask.title);
  };

  const cancelEditing = () => {
    setEditingSubtaskId(null);
    setEditingTitle('');
  };

  const subtasks = todo.subtasks || [];
  const progress = todo.subtaskProgress || { completed: 0, total: 0, percentage: 0 };

  if (!isExpanded && subtasks.length === 0) {
    return null;
  }

  return (
    <div className="subtasks-container mt-4 space-y-3">
      {/* Progress Bar */}
      {subtasks.length > 0 && (
        <div className="subtask-progress">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Subtasks ({progress.completed}/{progress.total})
            </span>
            <span className="text-sm font-medium text-blue-600">
              {progress.percentage}%
            </span>
          </div>
          <div className="progress-bar bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="progress-fill bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bulk-actions flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-800">
            {selectedSubtasks.size} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('complete')}
              className="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
            >
              Complete
            </button>
            <button
              onClick={() => handleBulkAction('incomplete')}
              className="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Uncomplete
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setSelectedSubtasks(new Set());
                setShowBulkActions(false);
              }}
              className="btn btn-sm bg-gray-500 hover:bg-gray-600 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Subtasks List */}
      {isExpanded && (
        <div className="subtasks-list space-y-2">
          {subtasks.map((subtask) => (
            <div
              key={subtask._id}
              className={`subtask-item flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                subtask.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Selection Checkbox */}
              <input
                type="checkbox"
                checked={selectedSubtasks.has(subtask._id)}
                onChange={() => handleSubtaskSelection(subtask._id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />

              {/* Completion Checkbox */}
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => handleToggleSubtask(subtask._id)}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />

              {/* Subtask Content */}
              <div className="flex-1">
                {editingSubtaskId === subtask._id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdateSubtask(subtask._id, editingTitle);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="btn btn-sm bg-gray-500 hover:bg-gray-600 text-white"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <span
                    className={`${
                      subtask.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    } cursor-pointer`}
                    onDoubleClick={() => startEditingSubtask(subtask)}
                  >
                    {subtask.title}
                  </span>
                )}
              </div>

              {/* Actions */}
              {editingSubtaskId !== subtask._id && (
                <div className="flex gap-1">
                  <button
                    onClick={() => startEditingSubtask(subtask)}
                    className="btn btn-xs bg-blue-500 hover:bg-blue-600 text-white"
                    title="Edit subtask"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteSubtask(subtask._id)}
                    className="btn btn-xs bg-red-500 hover:bg-red-600 text-white"
                    title="Delete subtask"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Subtask */}
      {isExpanded && (
        <div className="add-subtask">
          {isAddingSubtask ? (
            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Enter subtask..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="submit"
                className="btn bg-blue-500 hover:bg-blue-600 text-white"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingSubtask(false);
                  setNewSubtaskTitle('');
                }}
                className="btn bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingSubtask(true)}
              className="btn w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-dashed border-gray-300 hover:border-gray-400"
            >
              + Add Subtask
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Subtasks;
