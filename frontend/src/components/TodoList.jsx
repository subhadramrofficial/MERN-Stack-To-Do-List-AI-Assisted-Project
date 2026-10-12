import React from 'react';
import TodoItem from './TodoItem';

export default function TodoList({
  todos,
  isLoading,
  onToggle,
  onUpdate,
  onDelete,
  filterType,
  hasSearch
}) {
  if (isLoading) {
    return (
      <div className="list-loading-state">
        <div className="spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <h3 className="empty-title">
          {hasSearch
            ? 'No matching tasks found'
            : filterType === 'completed'
            ? 'No completed tasks yet'
            : filterType === 'active'
            ? 'No active tasks! You are all caught up.'
            : 'No tasks on your board'}
        </h3>
        <p className="empty-desc">
          {hasSearch
            ? 'Try searching with a different keyword or clear your filter.'
            : 'Add a new task above to stay productive!'}
        </p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
