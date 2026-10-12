const Todo = require('../models/Todo');

// @desc    Get all todos with optional filtering and search
// @route   GET /api/todos
// @access  Public
const getTodos = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy } = req.query;
    const query = {};

    // Filter by completion status
    if (status === 'active') {
      query.completed = false;
    } else if (status === 'completed') {
      query.completed = true;
    }

    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }

    // Search keyword in title or description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Sort order
    let sortOptions = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === 'dueDate') {
      sortOptions = { dueDate: 1, createdAt: -1 };
    } else if (sortBy === 'priority') {
      // Custom sorting can also be handled on frontend or basic order
      sortOptions = { priority: 1, createdAt: -1 };
    }

    const todos = await Todo.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single todo by ID
// @route   GET /api/todos/:id
// @access  Public
const getTodoById = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Todo not found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Public
const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      dueDate: dueDate || null
    });

    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Public
const updateTodo = async (req, res, next) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;

    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Todo not found with id ${req.params.id}`
      });
    }

    const updateFields = {};
    if (typeof title === 'string') updateFields.title = title.trim();
    if (typeof description === 'string') updateFields.description = description.trim();
    if (typeof completed === 'boolean') updateFields.completed = completed;
    if (priority && ['low', 'medium', 'high'].includes(priority)) updateFields.priority = priority;
    if (dueDate !== undefined) updateFields.dueDate = dueDate || null;

    todo = await Todo.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Public
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Todo not found with id ${req.params.id}`
      });
    }

    await Todo.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all completed todos
// @route   DELETE /api/todos/completed
// @access  Public
const clearCompletedTodos = async (req, res, next) => {
  try {
    const result = await Todo.deleteMany({ completed: true });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} completed todos`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  clearCompletedTodos
};
