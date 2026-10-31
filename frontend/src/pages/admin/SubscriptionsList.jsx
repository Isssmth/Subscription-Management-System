import React, { useState } from 'react';
import { initialSubscriptions } from '../../api/mockData';

export function SubscriptionsList({ onSelectSubscription }) {
  const [subscriptions] = useState(initialSubscriptions);

  return (
    <div className="admin-page-content">
      <div className="content-page-header">
        <div>
          <h1 className="content-page-title">Subscriptions</h1>
          <p className="content-page-subtitle">Manage customer active contracts and recurring renewals</p>
        </div>
      </div>

      <div className="content-card">
        <div className="table-responsive">
          <table className="ref-data-table">
            <thead>
              <tr>
                <th>Subscription ID</th>
                <th>Plan Name</th>
                <th>Customer</th>
                <th>Price / Frequency</th>
                <th>Start Date</th>
                <th>Next Billing</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id}>
                  <td className="font-semibold text-primary">{s.id}</td>
                  <td className="font-semibold">{s.planName}</td>
                  <td className="text-secondary">{s.customerName}</td>
                  <td className="font-semibold">
                    ₹{Number(s.price).toLocaleString('en-IN')}{' '}
                    <span className="text-muted text-xs">/{s.billingFrequency}</span>
                  </td>
                  <td className="text-secondary text-sm">{s.startDate}</td>
                  <td className="text-secondary text-sm">{s.nextBillingDate}</td>
                  <td>
                    <span
                      className={`status-badge-chip ${
                        s.status === 'Active' ? 'badge-green' : 'badge-amber'
                      }`}
                    >
                      ● {s.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn-text-action text-primary"
                      onClick={() => onSelectSubscription(s)}
                    >
                      View Details &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

