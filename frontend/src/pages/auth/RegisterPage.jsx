import React, { useState } from 'react';
import { LogoIcon, MailIcon, LockIcon, ArrowLeftIcon } from '../../components/Icons';

export function RegisterPage({ onRegisterSuccess, onBackToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Customer',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRegisterSuccess({
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });
    }, 400);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-split-wrapper">
        <div className="auth-banner-side">
          <div className="auth-banner-header">
            <LogoIcon size={36} />
            <span className="auth-brand-name">Brightloop</span>
          </div>

          <div className="auth-banner-content">
            <h2>Join Brightloop</h2>
            <p>Get started with state-of-the-art subscription billing and quotations today.</p>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-form-card">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Sign up for your Brightloop portal</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <div className="input-with-icon">
                  <span className="input-icon">
                    <MailIcon size={18} />
                  </span>
                  <input
                    type="email"
                    className="form-input icon-padded"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <select
                  className="form-input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Customer">Customer</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>

              <div className="auth-footer-text mt-16">
                Already have an account?{' '}
                <button type="button" className="link-btn font-bold text-primary" onClick={onBackToLogin}>
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

