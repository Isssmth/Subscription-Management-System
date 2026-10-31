import React, { useState } from 'react';
import { LogoIcon, CrownIcon } from '../../components/Icons';

export function CustomerPortal({ onSwitchToAdmin, onShowNotification }) {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [isPaused, setIsPaused] = useState(false);

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (onShowNotification) {
      onShowNotification(
        'info',
        !isPaused ? 'Subscription paused. Billing halted.' : 'Subscription resumed.'
      );
    }
  };

  return (
    <div className="customer-portal-layout">
      {/* Customer Portal Topbar matching bottom-left reference image */}
      <header className="customer-portal-header">
        <div className="customer-brand">
          <LogoIcon size={32} />
          <span className="brand-text">Brightloop</span>
        </div>

        <nav className="customer-nav-tabs">
          <button
            type="button"
            className={`customer-nav-tab ${activeTab === 'subscriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            My Subscriptions
          </button>
          <button
            type="button"
            className={`customer-nav-tab ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            Invoices
          </button>
          <button
            type="button"
            className={`customer-nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </nav>

        <div className="customer-header-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm mr-8"
            onClick={onSwitchToAdmin}
            title="Switch back to Admin view"
          >
            Switch to Admin &rarr;
          </button>
          <div className="customer-avatar-pill">JD</div>
        </div>
      </header>

      <main className="customer-portal-main">
        {activeTab === 'subscriptions' && (
          <>
            {/* Hero Banner matching bottom-left reference */}
            <div className="customer-hero-banner">
              <div className="customer-hero-text">
                <h1 className="customer-hero-title">Your Subscriptions</h1>
                <p className="customer-hero-sub">Manage your plans and billing details</p>
                <button
                  type="button"
                  className="btn btn-primary btn-lg mt-16"
                  onClick={() => {
                    const el = document.getElementById('active-plans-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View My Subscriptions
                </button>
              </div>

              {/* Illustration of person with laptop & plant matching reference */}
              <div className="customer-hero-illustration">
                <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Decorative Teal Circle Background */}
                  <circle cx="175" cy="45" r="14" fill="#00D2D3" opacity="0.8" />
                  {/* Plant leaves */}
                  <path d="M40 130C35 110 45 90 60 85C55 105 50 120 40 130Z" fill="#A29BFE" opacity="0.7" />
                  <path d="M50 135C50 115 65 100 80 98C70 115 62 128 50 135Z" fill="#887AF9" opacity="0.7" />
                  {/* Person Head & Hair */}
                  <ellipse cx="140" cy="55" rx="14" ry="16" fill="#F8C4B4" />
                  <path d="M130 52C128 42 136 34 148 35C158 36 160 48 152 56C148 50 142 50 136 53Z" fill="#2E2C68" />
                  <path d="M125 56C122 66 126 80 132 88C132 75 130 65 125 56Z" fill="#2E2C68" />
                  {/* Person Body (Lavender/Purple Top) */}
                  <path d="M125 78C115 82 105 92 100 115H170C165 92 155 82 145 78Z" fill="#887AF9" />
                  {/* Desk & Laptop */}
                  <rect x="75" y="125" width="130" height="8" rx="2" fill="#C5CEFA" />
                  <path d="M150 100L165 125H195L178 100H150Z" fill="#2E2C68" />
                  <path d="M155 103L167 122H190L174 103H155Z" fill="#5E4CFC" />
                  <path d="M160 125H200L195 128H165L160 125Z" fill="#9CA8F5" />
                </svg>
              </div>
            </div>

            {/* Active Plans Section matching bottom-left reference */}
            <div id="active-plans-section" className="customer-plans-section">
              <h2 className="section-title mb-16">Your Active Plans</h2>

              <div className="content-card customer-plan-card">
                <div className="plan-card-left">
                  <div className="crown-badge-box">
                    <CrownIcon size={24} className="text-amber" />
                  </div>
                  <div>
                    <div className="flex-center gap-10">
                      <h3 className="plan-card-name font-bold">Pro Plan</h3>
                      <span className={`status-badge-chip ${!isPaused ? 'badge-green' : 'badge-amber'}`}>
                        {!isPaused ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <span className="text-secondary text-sm">Monthly • 5 users</span>
                  </div>
                </div>

                <div className="plan-card-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      if (onShowNotification) onShowNotification('info', 'Viewing Pro Plan full contract details.');
                    }}
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    className={`btn ${!isPaused ? 'btn-outline' : 'btn-primary'}`}
                    onClick={togglePause}
                  >
                    {!isPaused ? 'Pause' : 'Resume'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'invoices' && (
          <div className="customer-invoices-view">
            <h1 className="content-page-title mb-16">My Invoices</h1>
            <div className="content-card">
              <div className="table-responsive">
                <table className="ref-data-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Plan Cycle</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-semibold text-primary">#INV-1001</td>
                      <td>Pro Plan (Jan 2025)</td>
                      <td className="font-semibold">₹2,360</td>
                      <td className="text-secondary">Jan 1, 2025</td>
                      <td><span className="badge-chip chip-paid">Paid</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <button type="button" className="btn-text-action text-primary">
                          PDF &darr;
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="customer-profile-view">
            <h1 className="content-page-title mb-16">My Profile</h1>
            <div className="content-card profile-details-card">
              <div className="profile-header-row mb-24">
                <div className="customer-avatar-lg">JD</div>
                <div>
                  <h2 className="font-bold">John Doe</h2>
                  <span className="text-secondary">john@acme.com • Acme Corp</span>
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="field-label">Company Name</label>
                  <input type="text" className="form-input" defaultValue="Acme Corp" readOnly />
                </div>
                <div className="form-group">
                  <label className="field-label">Billing Email</label>
                  <input type="email" className="form-input" defaultValue="billing@acme.com" readOnly />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

