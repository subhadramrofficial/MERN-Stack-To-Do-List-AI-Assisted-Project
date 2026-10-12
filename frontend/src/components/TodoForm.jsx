import React, { useState } from 'react';

export default function TodoForm({ onAddTodo, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    setError('');
    const newTodo = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null
    };

    const success = await onAddTodo(newTodo);
    if (success) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setShowDetails(false);
    }
  };

  return (
    <form className="todo-form-card" onSubmit={handleSubmit}>
      <div className="form-main-input-row">
        <input
          type="text"
          className="todo-input-title"
          placeholder="What needs to be done? Press Enter to add..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          disabled={isLoading}
        />
        <button
          type="button"
          className={`toggle-details-btn ${showDetails ? 'active' : ''}`}
          onClick={() => setShowDetails(!showDetails)}
          title="More options (description, priority, due date)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>{showDetails ? 'Less' : 'Details'}</span>
        </button>
        <button
          type="submit"
          className="btn-primary submit-btn"
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      {error && <p className="form-error-msg">{error}</p>}

      {showDetails && (
        <div className="form-extra-fields">
          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="todo-input-desc"
              rows="2"
              placeholder="Add additional notes or details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-row-two-col">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <div className="priority-selector">
                {['low', 'medium', 'high'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`priority-chip ${priority === lvl ? `selected ${lvl}` : ''}`}
                    onClick={() => setPriority(lvl)}
                  >
                    <span className={`priority-dot ${lvl}`}></span>
                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="todo-input-date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
