const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

// GET all todos for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not connected. Please check MongoDB connection.' 
      });
    }
    
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET a specific todo for authenticated user
router.get('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a new todo for authenticated user
router.post('/', auth, async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      category: req.body.category,
      subtasks: req.body.subtasks || [],
      dueDate: req.body.dueDate,
      user: req.user._id
    });

    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a todo for authenticated user
router.put('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Update fields if provided
    if (req.body.title !== undefined) todo.title = req.body.title;
    if (req.body.description !== undefined) todo.description = req.body.description;
    if (req.body.completed !== undefined) todo.completed = req.body.completed;
    if (req.body.priority !== undefined) todo.priority = req.body.priority;
    if (req.body.category !== undefined) todo.category = req.body.category;
    if (req.body.subtasks !== undefined) todo.subtasks = req.body.subtasks;
    if (req.body.dueDate !== undefined) todo.dueDate = req.body.dueDate;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a todo for authenticated user
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TOGGLE todo completion status for authenticated user
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.completed = !todo.completed;
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// SUBTASK ROUTES

// Add a subtask to a todo
router.post('/:id/subtasks', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updatedTodo = await todo.addSubtask(req.body.title);
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Toggle subtask completion
router.patch('/:id/subtasks/:subtaskId/toggle', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updatedTodo = await todo.toggleSubtask(req.params.subtaskId);
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update subtask title
router.put('/:id/subtasks/:subtaskId', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updatedTodo = await todo.updateSubtask(req.params.subtaskId, req.body.title);
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a subtask
router.delete('/:id/subtasks/:subtaskId', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updatedTodo = await todo.removeSubtask(req.params.subtaskId);
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk operations on subtasks
router.patch('/:id/subtasks/bulk', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const { action, subtaskIds } = req.body;
    
    if (action === 'complete') {
      subtaskIds.forEach(subtaskId => {
        const subtask = todo.subtasks.id(subtaskId);
        if (subtask) subtask.completed = true;
      });
    } else if (action === 'incomplete') {
      subtaskIds.forEach(subtaskId => {
        const subtask = todo.subtasks.id(subtaskId);
        if (subtask) subtask.completed = false;
      });
    } else if (action === 'delete') {
      subtaskIds.forEach(subtaskId => {
        todo.subtasks.pull(subtaskId);
      });
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
