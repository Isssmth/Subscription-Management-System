import React from 'react';

export function EmptyState({ title, description, actionText, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📦</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionText && onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}

