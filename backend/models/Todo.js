const mongoose = require('mongoose');

// Subtask schema
const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true }); // Ensure each subtask has an _id

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  subtasks: [subtaskSchema],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'shopping', 'health', 'finance', 'education', 'travel', 'family', 'hobbies', 'other'],
    default: 'personal'
  },
  dueDate: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for subtask completion progress
todoSchema.virtual('subtaskProgress').get(function() {
  if (!this.subtasks || this.subtasks.length === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }
  
  const completed = this.subtasks.filter(subtask => subtask.completed).length;
  const total = this.subtasks.length;
  const percentage = Math.round((completed / total) * 100);
  
  return { completed, total, percentage };
});

// Method to add a subtask
todoSchema.methods.addSubtask = function(title) {
  this.subtasks.push({ title });
  return this.save();
};

// Method to toggle subtask completion
todoSchema.methods.toggleSubtask = function(subtaskId) {
  const subtask = this.subtasks.id(subtaskId);
  if (subtask) {
    subtask.completed = !subtask.completed;
    return this.save();
  }
  throw new Error('Subtask not found');
};

// Method to remove a subtask
todoSchema.methods.removeSubtask = function(subtaskId) {
  this.subtasks.pull(subtaskId);
  return this.save();
};

// Method to update subtask title
todoSchema.methods.updateSubtask = function(subtaskId, title) {
  const subtask = this.subtasks.id(subtaskId);
  if (subtask) {
    subtask.title = title;
    return this.save();
  }
  throw new Error('Subtask not found');
};

// Ensure virtual fields are serialized
todoSchema.set('toJSON', { virtuals: true });
todoSchema.set('toObject', { virtuals: true });

// Update the updatedAt field before saving
todoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Todo', todoSchema);
