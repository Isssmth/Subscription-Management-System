import React, { useState } from 'react';
import { PlusIcon } from '../../components/Icons';
import { initialQuotations } from '../../api/mockData';

export function QuotationsList({ onCreateNew, onShowNotification }) {
  const [quotations, setQuotations] = useState(initialQuotations);

  return (
    <div className="admin-page-content">
      <div className="content-page-header">
        <div>
          <h1 className="content-page-title">Quotations</h1>
          <p className="content-page-subtitle">Track drafted, sent, and converted subscription quotations</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={onCreateNew}>
          <PlusIcon size={16} />
          <span>Create Quotation</span>
        </button>
      </div>

      <div className="content-card">
        <div className="table-responsive">
          <table className="ref-data-table">
            <thead>
              <tr>
                <th>Quotation #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Subtotal</th>
                <th>Total (with Tax)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id}>
                  <td className="font-semibold text-primary">{q.id}</td>
                  <td className="font-semibold">{q.customerName}</td>
                  <td className="text-secondary text-sm">{q.date}</td>
                  <td>₹{q.subtotal.toLocaleString('en-IN')}</td>
                  <td className="font-semibold">₹{q.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span
                      className={`status-badge-chip ${
                        q.status === 'Sent'
                          ? 'badge-blue'
                          : q.status === 'Draft'
                          ? 'badge-slate'
                          : 'badge-green'
                      }`}
                    >
                      {q.status}
                    </span>
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

