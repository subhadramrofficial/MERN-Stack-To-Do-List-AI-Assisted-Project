import React, { useState } from 'react';

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium');
  const [editDueDate, setEditDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
  );
  const [showDesc, setShowDesc] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    onUpdate(todo._id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
      dueDate: editDueDate ? new Date(editDueDate).toISOString() : null
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority || 'medium');
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
    setIsEditing(false);
  };

  // Due date formatting & overdue calculation
  const getDueStatus = () => {
    if (!todo.dueDate) return null;
    const due = new Date(todo.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDay = new Date(due);
    dueDay.setHours(0, 0, 0, 0);

    const isOverdue = dueDay < today && !todo.completed;
    const isDueToday = dueDay.getTime() === today.getTime();

    const formatted = due.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    return {
      formatted,
      isOverdue,
      isDueToday
    };
  };

  const dueInfo = getDueStatus();

  if (isEditing) {
    return (
      <li className="todo-item editing-mode">
        <form onSubmit={handleSave} className="edit-form">
          <input
            type="text"
            className="edit-input-title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
            autoFocus
          />
          <textarea
            className="edit-input-desc"
            rows="2"
            value={editDescription}
            placeholder="Description..."
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <div className="edit-options-row">
            <select
              className="edit-select-priority"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              className="edit-input-date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
            />
            <div className="edit-actions">
              <button type="submit" className="btn-save">Save</button>
              <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-item-main">
        {/* Checkbox */}
        <button
          type="button"
          className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={() => onToggle(todo._id, !todo.completed)}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="todo-content" onClick={() => todo.description && setShowDesc(!showDesc)}>
          <div className="todo-title-row">
            <span className="todo-title">{todo.title}</span>

            {/* Priority Tag */}
            <span className={`priority-tag ${todo.priority}`}>
              {todo.priority}
            </span>

            {/* Due Date Tag */}
            {dueInfo && (
              <span className={`due-tag ${dueInfo.isOverdue ? 'overdue' : dueInfo.isDueToday ? 'due-today' : ''}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {dueInfo.isOverdue ? `Overdue (${dueInfo.formatted})` : dueInfo.isDueToday ? 'Today' : dueInfo.formatted}
              </span>
            )}
          </div>

          {/* Optional description preview */}
          {todo.description && (
            <div className={`todo-description ${showDesc ? 'expanded' : ''}`}>
              {todo.description}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="todo-actions">
          {todo.description && (
            <button
              type="button"
              className="action-icon-btn info-btn"
              onClick={() => setShowDesc(!showDesc)}
              title={showDesc ? 'Hide notes' : 'View notes'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
          )}

          <button
            type="button"
            className="action-icon-btn edit-btn"
            onClick={() => setIsEditing(true)}
            title="Edit task"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>

          <button
            type="button"
            className="action-icon-btn delete-btn"
            onClick={() => onDelete(todo._id)}
            title="Delete task"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}
