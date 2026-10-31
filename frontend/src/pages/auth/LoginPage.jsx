import React, { useState } from 'react';
import { LogoIcon, MailIcon, LockIcon } from '../../components/Icons';

export function LoginPage({ onLoginSuccess, onNavigateToForgot, onNavigateToRegister }) {
  const [email, setEmail] = useState('admin@brightloop.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({ name: 'Admin', role: 'Administrator', email });
    }, 400);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-split-wrapper">
        {/* Left Visual Banner */}
        <div className="auth-banner-side">
          <div className="auth-banner-header">
            <LogoIcon size={36} />
            <span className="auth-brand-name">Brightloop</span>
          </div>

          <div className="auth-banner-content">
            <h2>Subscription Management<br />Made Simple</h2>
            <p>Automate recurring billing, plans, quotations, and product catalog effortlessly.</p>

            {/* Isometric illustration matching top-left reference */}
            <div className="auth-laptop-illustration">
              <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Floating Purple Cloud */}
                <path d="M180 50C180 43.37 174.63 38 168 38C166.8 38 165.65 38.18 164.57 38.51C162.7 33.51 157.9 30 152.28 30C144.95 30 139 35.95 139 43.28C139 44.02 139.06 44.75 139.18 45.45C136.78 46.54 135.1 48.98 135.1 51.81C135.1 55.73 138.27 58.9 142.19 58.9H177C181.42 58.9 185 55.32 185 50.9C185 47.78 183.18 45.08 180.55 43.83" fill="#8B7BFE" opacity="0.8" />
                {/* Laptop Base */}
                <ellipse cx="120" cy="145" rx="90" ry="22" fill="#E4E7FD" />
                <path d="M40 135L70 148H170L200 135H40Z" fill="#C5CEFA" />
                <path d="M68 147L120 153L172 147H68Z" fill="#9CA8F5" />
                {/* Laptop Screen */}
                <path d="M55 75L120 40L185 75V135L120 145L55 135V75Z" fill="#2E2C68" />
                <path d="M63 79L120 48L177 79V130L120 140L63 130V79Z" fill="#FFFFFF" />
                {/* Chart Bars on Screen */}
                <rect x="75" y="100" width="12" height="24" rx="2" fill="#6C5CE7" />
                <rect x="95" y="85" width="12" height="39" rx="2" fill="#A29BFE" />
                <rect x="115" y="70" width="12" height="54" rx="2" fill="#5E4CFC" />
                <rect x="135" y="92" width="12" height="32" rx="2" fill="#00D2D3" />
                <rect x="155" y="60" width="12" height="64" rx="2" fill="#5E4CFC" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side">
          <div className="auth-form-card">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <div className="input-with-icon">
                  <span className="input-icon">
                    <MailIcon size={18} />
                  </span>
                  <input
                    type="email"
                    className="form-input icon-padded"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-with-icon">
                  <span className="input-icon">
                    <LockIcon size={18} />
                  </span>
                  <input
                    type="password"
                    className="form-input icon-padded"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="forgot-password-link">
                  <button type="button" className="link-btn" onClick={onNavigateToForgot}>
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </button>

              <div className="auth-separator">
                <span>or</span>
              </div>

              <div className="auth-footer-text">
                Don't have an account?{' '}
                <button type="button" className="link-btn font-bold text-primary" onClick={onNavigateToRegister}>
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

