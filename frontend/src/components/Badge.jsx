import React from 'react';

export function Badge({ type, text, variant }) {
  let badgeClass = 'badge ';

  if (variant) {
    badgeClass += `badge-${variant}`;
  } else if (typeof type === 'boolean') {
    badgeClass += type ? 'badge-active' : 'badge-inactive';
  } else if (typeof type === 'string') {
    badgeClass += `badge-${type.toLowerCase()}`;
  }

  const displayText = text || (typeof type === 'boolean' ? (type ? 'Active' : 'Inactive') : type);

  return <span className={badgeClass}>{displayText}</span>;
}

