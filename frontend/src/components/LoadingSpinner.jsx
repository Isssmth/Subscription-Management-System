import React from 'react';

export function LoadingSpinner({ message = 'Loading catalog data...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}

