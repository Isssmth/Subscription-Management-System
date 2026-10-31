import React, { useEffect } from 'react';

export function Notification({ notification, onClose }) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const { type = 'info', message } = notification;

  return (
    <div className={`notification-toast notification-${type}`}>
      <div className="notification-content">
        <span className="notification-icon">
          {type === 'success' && '✓'}
          {type === 'error' && '⚠'}
          {type === 'info' && 'ℹ'}
        </span>
        <span className="notification-message">{message}</span>
      </div>
      <button type="button" className="notification-close" onClick={onClose} aria-label="Close notification">
        &times;
      </button>
    </div>
  );
}

