import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import TodoForm from './components/TodoForm';
import FilterTabs from './components/FilterTabs';
import TodoList from './components/TodoList';
import { todoApi } from './api/todoApi';
import './App.css';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [alert, setAlert] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(true);

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // Fetch todos from Express backend
  const loadTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await todoApi.getAll({
        status: statusFilter,
        priority: priorityFilter,
        search: searchQuery,
        sortBy
      });
      setTodos(data);
      setIsBackendConnected(true);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setIsBackendConnected(false);
      showAlert(`Could not connect to backend API: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, priorityFilter, searchQuery, sortBy]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Handler: Add Todo
  const handleAddTodo = async (newTodoData) => {
    try {
      setIsSubmitting(true);
      const created = await todoApi.create(newTodoData);
      setTodos((prev) => [created, ...prev]);
      showAlert('Task created successfully!', 'success');
      return true;
    } catch (err) {
      console.error('Error adding todo:', err);
      showAlert(`Failed to create task: ${err.message}`, 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Toggle completion status
  const handleToggle = async (id, newCompletedState) => {
    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: newCompletedState } : t))
    );

    try {
      await todoApi.update(id, { completed: newCompletedState });
    } catch (err) {
      console.error('Error toggling status:', err);
      showAlert(`Failed to update task: ${err.message}`, 'error');
      // Rollback on failure
      loadTodos();
    }
  };

  // Handler: Update details
  const handleUpdate = async (id, updateFields) => {
    try {
      const updated = await todoApi.update(id, updateFields);
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
      showAlert('Task updated successfully!', 'success');
    } catch (err) {
      console.error('Error updating todo:', err);
      showAlert(`Failed to update task: ${err.message}`, 'error');
    }
  };

  // Handler: Delete Todo
  const handleDelete = async (id) => {
    // Optimistic UI update
    const previousTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t._id !== id));

    try {
      await todoApi.delete(id);
      showAlert('Task removed', 'info');
    } catch (err) {
      console.error('Error deleting todo:', err);
      showAlert(`Failed to delete task: ${err.message}`, 'error');
      setTodos(previousTodos);
    }
  };

  // Handler: Clear completed
  const handleClearCompleted = async () => {
    if (!window.confirm('Are you sure you want to remove all completed tasks?')) return;

    try {
      await todoApi.clearCompleted();
      showAlert('Completed tasks cleared', 'success');
      loadTodos();
    } catch (err) {
      console.error('Error clearing completed:', err);
      showAlert(`Failed to clear completed tasks: ${err.message}`, 'error');
    }
  };

  // Calculate counts for tab badges
  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length
  };

  return (
    <div className="app-layout">
      {/* Backend Disconnected Warning */}
      {!isBackendConnected && (
        <div className="connection-banner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>
            <strong>Backend API Offline:</strong> Start the backend server on port 5000 and ensure MongoDB is running.
          </span>
          <button className="banner-retry-btn" onClick={loadTodos}>Retry</button>
        </div>
      )}

      {/* Floating Alert Notification */}
      {alert && (
        <div className={`toast-notification ${alert.type}`}>
          <span>{alert.message}</span>
          <button onClick={() => setAlert(null)}>×</button>
        </div>
      )}

      <div className="app-container">
        <Header totalCount={counts.all} completedCount={counts.completed} />

        <StatsBar todos={todos} />

        <main className="main-content">
          <TodoForm onAddTodo={handleAddTodo} isLoading={isSubmitting} />

          <FilterTabs
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            completedCount={counts.completed}
            onClearCompleted={handleClearCompleted}
            counts={counts}
          />

          <TodoList
            todos={todos}
            isLoading={isLoading}
            onToggle={handleToggle}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            filterType={statusFilter}
            hasSearch={Boolean(searchQuery.trim())}
          />
        </main>

        <footer className="footer">
          <p>
            MERN Stack Todo Application &bull; Built with MongoDB, Express, React &amp; Node.js
          </p>
        </footer>
      </div>
    </div>
  );
}
