import React, { useState } from 'react';
import { BellIcon } from './Icons';

export function Header({
  onToggleMobile,
  currentViewMode,
  onChangeViewMode,
  user = { name: 'Admin', role: 'Administrator', avatarText: 'AD' },
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleMobile}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>

      <div className="header-right">
        {/* Switch View Mode Pill for Testing & Demoing Every Reference Screen */}
        <div className="view-mode-selector">
          <button
            type="button"
            className="view-mode-btn"
            onClick={() => setShowViewMenu(!showViewMenu)}
          >
            <span className="view-mode-indicator" />
            <span className="view-mode-label">
              {currentViewMode === 'admin'
                ? 'Admin View'
                : currentViewMode === 'customer'
                ? 'Customer Portal'
                : 'Auth Screens'}
            </span>
            <span className="dropdown-arrow">▾</span>
          </button>

          {showViewMenu && (
            <div className="dropdown-menu">
              <button
                type="button"
                className={`dropdown-item ${currentViewMode === 'admin' ? 'active' : ''}`}
                onClick={() => {
                  onChangeViewMode('admin');
                  setShowViewMenu(false);
                }}
              >
                🏢 Admin / Staff Dashboard
              </button>
              <button
                type="button"
                className={`dropdown-item ${currentViewMode === 'customer' ? 'active' : ''}`}
                onClick={() => {
                  onChangeViewMode('customer');
                  setShowViewMenu(false);
                }}
              >
                👤 Customer Portal
              </button>
              <button
                type="button"
                className={`dropdown-item ${currentViewMode === 'auth-login' ? 'active' : ''}`}
                onClick={() => {
                  onChangeViewMode('auth-login');
                  setShowViewMenu(false);
                }}
              >
                🔐 Auth: Login Screen
              </button>
              <button
                type="button"
                className={`dropdown-item ${currentViewMode === 'auth-forgot' ? 'active' : ''}`}
                onClick={() => {
                  onChangeViewMode('auth-forgot');
                  setShowViewMenu(false);
                }}
              >
                ✉️ Auth: Forgot Password Screen
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon with dot */}
        <div className="header-icon-badge">
          <button type="button" className="icon-btn" aria-label="Notifications">
            <BellIcon size={20} />
            <span className="notification-dot" />
          </button>
        </div>

        {/* User Profile Pill */}
        <div className="user-profile-menu">
          <button
            type="button"
            className="user-profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="avatar-circle">{user.avatarText || 'AD'}</div>
            <span className="user-name">{user.name}</span>
            <span className="dropdown-arrow">▾</span>
          </button>

          {showProfileMenu && (
            <div className="dropdown-menu profile-dropdown">
              <div className="dropdown-header">
                <span className="font-semibold">{user.name}</span>
                <span className="text-xs text-muted">{user.role}</span>
              </div>
              <div className="dropdown-divider" />
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  onChangeViewMode('customer');
                  setShowProfileMenu(false);
                }}
              >
                Switch to Customer Portal
              </button>
              <button
                type="button"
                className="dropdown-item text-danger"
                onClick={() => {
                  onChangeViewMode('auth-login');
                  setShowProfileMenu(false);
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

