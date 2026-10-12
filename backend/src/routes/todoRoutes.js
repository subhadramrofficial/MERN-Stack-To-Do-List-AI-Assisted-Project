const express = require('express');
const router = express.Router();
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  clearCompletedTodos
} = require('../controllers/todoController');

// Bulk actions (must come before /:id routes)
router.delete('/completed', clearCompletedTodos);

// Main CRUD routes
router
  .route('/')
  .get(getTodos)
  .post(createTodo);

router
  .route('/:id')
  .get(getTodoById)
  .put(updateTodo)
  .delete(deleteTodo);

module.exports = router;
