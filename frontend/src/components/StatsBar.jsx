import React from 'react';

export default function StatsBar({ todos = [] }) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  const highPriority = todos.filter(t => !t.completed && t.priority === 'high').length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-container">
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{pending}</span>
        </div>
        <div className="stat-card stat-completed">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completed}</span>
        </div>
        <div className="stat-card stat-urgent">
          <span className="stat-label">High Priority</span>
          <span className="stat-value">{highPriority}</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-title">Completion Progress</span>
          <span className="progress-pct">{percent}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
