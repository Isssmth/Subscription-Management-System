import React, { useState } from 'react';
import { LogoIcon, MailIcon, ArrowLeftIcon } from '../../components/Icons';

export function ForgotPasswordPage({ onBackToLogin, onShowNotification }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      if (onShowNotification) {
        onShowNotification('success', 'Reset instructions sent to your email.');
      }
    }, 500);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-split-wrapper">
        {/* Left Side: Purple Visual matching bottom-right reference */}
        <div className="auth-banner-side purple-gradient">
          <div className="auth-banner-header">
            <LogoIcon size={36} />
            <span className="auth-brand-name">Brightloop</span>
          </div>

          <div className="auth-banner-content">
            <h2>Reset Your Password</h2>
            <p>Enter your registered email address and we'll send you a reset link.</p>

            {/* Envelope with Flying Card Illustration */}
            <div className="auth-envelope-illustration">
              <svg width="220" height="180" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Envelope Base Shadow */}
                <ellipse cx="110" cy="155" rx="80" ry="18" fill="#4B3EC0" opacity="0.4" />
                {/* Envelope Back */}
                <path d="M40 90H180V145C180 150.5 175.5 155 170 155H50C44.5 155 40 150.5 40 145V90Z" fill="#7162F8" />
                {/* Flying White Card */}
                <rect x="60" y="45" width="100" height="70" rx="6" fill="#FFFFFF" />
                <rect x="75" y="60" width="70" height="6" rx="3" fill="#DCD8FF" />
                <rect x="75" y="74" width="50" height="6" rx="3" fill="#DCD8FF" />
                <circle cx="135" cy="90" r="10" fill="#5E4CFC" />
                <path d="M132 90L134.5 92.5L138.5 87.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {/* Envelope Flaps */}
                <path d="M40 90L110 130L180 90V145C180 150.5 175.5 155 170 155H50C44.5 155 40 150.5 40 145V90Z" fill="#887AF9" />
                <path d="M40 90L110 135L180 90" stroke="#7162F8" strokeWidth="3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-side">
          <div className="auth-form-card">
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-subtitle">We'll send you a link to reset your password.</p>

            {sent ? (
              <div className="reset-sent-box">
                <div className="success-icon-badge">✓</div>
                <h3>Check your inbox</h3>
                <p>We've sent a password reset link to <strong>{email}</strong>.</p>
                <button type="button" className="btn btn-primary btn-block mt-16" onClick={onBackToLogin}>
                  Back to Login
                </button>
              </div>
            ) : (
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

                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className="auth-back-link">
                  <button type="button" className="link-btn flex-center gap-6" onClick={onBackToLogin}>
                    <ArrowLeftIcon size={16} />
                    <span>Back to Login</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

