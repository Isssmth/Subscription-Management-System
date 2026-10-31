import React, { useState } from 'react';
import { ArrowLeftIcon, CrownIcon } from '../../components/Icons';

export function SubscriptionDetails({ subscription = null, onBack, onShowNotification }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showManageMenu, setShowManageMenu] = useState(false);
  const [status, setStatus] = useState(subscription?.status || 'Active');

  const sub = subscription || {
    id: 'SUB-101',
    planName: 'Pro Plan',
    price: 2000,
    billingFrequency: 'month',
    customerName: 'Acme Corp',
    startDate: 'Jan 1, 2025',
    nextBillingDate: 'Feb 1, 2025',
    status: 'Active',
  };

  const handleTogglePause = () => {
    const next = status === 'Active' ? 'Paused' : 'Active';
    setStatus(next);
    setShowManageMenu(false);
    if (onShowNotification) {
      onShowNotification('success', `Subscription marked as ${next}.`);
    }
  };

  return (
    <div className="admin-page-content">
      {/* Top Breadcrumb */}
      <div className="form-page-topbar mb-16">
        <button type="button" className="back-link-btn" onClick={onBack}>
          <ArrowLeftIcon size={16} />
          <span>Back</span>
        </button>
      </div>

      {/* Header with status badge matching bottom-center reference image */}
      <div className="content-page-header">
        <div className="flex-center gap-12">
          <h1 className="content-page-title">Subscription Details</h1>
          <span className={`status-badge-chip ${status === 'Active' ? 'badge-green' : 'badge-amber'}`}>
            ● {status}
          </span>
        </div>
      </div>

      {/* Hero Card with Crown, Plan Name, Price, and Manage Subscription button */}
      <div className="content-card subscription-hero-card">
        <div className="hero-left-section">
          <div className="crown-badge-box">
            <CrownIcon size={26} className="text-amber" />
          </div>
          <div>
            <h2 className="hero-plan-title">{sub.planName}</h2>
            <div className="hero-plan-price">
              <span className="price-amount">₹{Number(sub.price).toLocaleString('en-IN')}</span>
              <span className="price-cycle">/ {sub.billingFrequency || 'month'}</span>
            </div>
          </div>
        </div>

        {/* Manage Subscription Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="btn btn-primary manage-sub-btn"
            onClick={() => setShowManageMenu(!showManageMenu)}
          >
            <span>Manage Subscription</span>
            <span className="dropdown-arrow">▾</span>
          </button>

          {showManageMenu && (
            <div className="dropdown-menu right-aligned">
              <button type="button" className="dropdown-item" onClick={handleTogglePause}>
                {status === 'Active' ? '⏸️ Pause Subscription' : '▶️ Resume Subscription'}
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setShowManageMenu(false);
                  if (onShowNotification) onShowNotification('info', 'Change Plan modal opened.');
                }}
              >
                🔄 Change Plan
              </button>
              <div className="dropdown-divider" />
              <button
                type="button"
                className="dropdown-item text-danger"
                onClick={() => {
                  setStatus('Cancelled');
                  setShowManageMenu(false);
                  if (onShowNotification) onShowNotification('info', 'Subscription cancelled.');
                }}
              >
                ❌ Cancel Subscription
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs: Overview, Invoices, History */}
      <div className="content-card sub-tabs-card">
        <div className="sub-tab-headers">
          {['Overview', 'Invoices', 'History'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`sub-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="sub-tab-content">
          {activeTab === 'Overview' && (
            <div className="overview-details-grid">
              <div className="overview-col">
                <span className="overview-label">Start Date</span>
                <span className="overview-value font-semibold">{sub.startDate}</span>
              </div>
              <div className="overview-col">
                <span className="overview-label">Next Billing Date</span>
                <span className="overview-value font-semibold">{sub.nextBillingDate}</span>
              </div>
              <div className="overview-col">
                <span className="overview-label">Status</span>
                <span className="overview-value text-success font-semibold">{status}</span>
              </div>
            </div>
          )}

          {activeTab === 'Invoices' && (
            <div className="invoices-subtable">
              <table className="ref-data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-semibold text-primary">#INV-1001</td>
                    <td>{sub.startDate}</td>
                    <td className="font-semibold">₹{Number(sub.price).toLocaleString('en-IN')}</td>
                    <td><span className="badge-chip chip-paid">Paid</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'History' && (
            <div className="history-timeline">
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-title">Subscription created</span>
                  <span className="timeline-time">{sub.startDate}</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-title">Payment confirmed via Razorpay</span>
                  <span className="timeline-time">{sub.startDate}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

