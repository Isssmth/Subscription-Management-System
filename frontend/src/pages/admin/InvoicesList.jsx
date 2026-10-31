import React, { useState } from 'react';
import { initialInvoices } from '../../api/mockData';

export function InvoicesList() {
  const [invoices] = useState(initialInvoices);

  return (
    <div className="admin-page-content">
      <div className="content-page-header">
        <div>
          <h1 className="content-page-title">Invoices</h1>
          <p className="content-page-subtitle">Track billed subscription cycles and payment status</p>
        </div>
      </div>

      <div className="content-card">
        <div className="table-responsive">
          <table className="ref-data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Subscription ID</th>
                <th>Customer</th>
                <th>Plan Cycle</th>
                <th>Amount (₹)</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-semibold text-primary">{inv.id}</td>
                  <td className="text-secondary">{inv.subscriptionId}</td>
                  <td className="font-semibold">{inv.customerName}</td>
                  <td className="text-secondary">{inv.planName}</td>
                  <td className="font-semibold">₹{Number(inv.amount).toLocaleString('en-IN')}</td>
                  <td className="text-secondary text-sm">{inv.dueDate}</td>
                  <td>
                    <span
                      className={`status-badge-chip ${
                        inv.status === 'Paid'
                          ? 'badge-green'
                          : inv.status === 'Overdue'
                          ? 'badge-red'
                          : 'badge-slate'
                      }`}
                    >
                      {inv.status}
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

