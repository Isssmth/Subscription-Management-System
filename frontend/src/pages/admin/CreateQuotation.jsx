import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '../../components/Icons';
import { initialCustomers } from '../../api/mockData';

export function CreateQuotation({ onBack, onSaveSuccess, onShowNotification }) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(1);
  const [items, setItems] = useState([
    {
      id: 1,
      productName: 'Odoo Software',
      variantName: 'Odoo Brand',
      quantity: 1,
      unitPrice: 5560,
    },
    {
      id: 2,
      productName: 'Microsoft 365',
      variantName: '',
      quantity: 1,
      unitPrice: 4000,
    },
  ]);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const taxRate = 18;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        productName: 'Adobe Acrobat',
        variantName: '',
        quantity: 1,
        unitPrice: 2500,
      },
    ]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, qty) => {
    const val = parseInt(qty, 10) || 1;
    setItems(items.map((it) => (it.id === id ? { ...it, quantity: val } : it)));
  };

  const handleSave = (isDraft = false) => {
    const cust = initialCustomers.find((c) => c.id === Number(selectedCustomerId));
    const newQuotation = {
      id: `QT-2025-${Math.floor(100 + Math.random() * 900)}`,
      customerName: cust ? cust.name : 'Acme Corp',
      items,
      subtotal,
      taxRate,
      taxAmount,
      total,
      status: isDraft ? 'Draft' : 'Sent',
      date: new Date().toISOString().split('T')[0],
    };

    if (onShowNotification) {
      onShowNotification('success', `Quotation ${newQuotation.id} ${isDraft ? 'saved as draft' : 'created'}.`);
    }
    if (onSaveSuccess) onSaveSuccess(newQuotation);
  };

  return (
    <div className="admin-page-content">
      {/* Breadcrumb & Save Draft matching middle-right reference image */}
      <div className="content-page-header">
        <div>
          <span className="breadcrumb-nav">Quotations &gt; New</span>
          <h1 className="content-page-title mt-4">Create Quotation</h1>
        </div>
        <button type="button" className="btn btn-outline" onClick={() => handleSave(true)}>
          Save Draft
        </button>
      </div>

      <div className="quotation-layout-grid">
        {/* Left Column: Customer & Products */}
        <div className="content-card quotation-form-main">
          {/* Customer Selector */}
          <div className="form-group mb-24">
            <label className="field-label">Customer</label>
            <select
              className="form-input"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
              <option value="">Select Customer</option>
              {initialCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>

          {/* Products List */}
          <div className="quotation-products-section">
            <div className="section-label-row mb-12">
              <span className="field-label mb-0">Products</span>
            </div>

            <div className="quotation-items-table">
              {items.map((item) => (
                <div key={item.id} className="quotation-item-row">
                  <div className="item-name-col">
                    <span className="font-semibold">{item.productName}</span>
                  </div>

                  <div className="item-variant-col">
                    {item.variantName ? (
                      <span className="variant-pill-tag">{item.variantName} ▾</span>
                    ) : (
                      <span className="text-muted text-sm">—</span>
                    )}
                  </div>

                  <div className="item-qty-col">
                    <input
                      type="number"
                      min="1"
                      className="form-input qty-input"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    />
                  </div>

                  <div className="item-price-col">
                    <span className="font-semibold">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="item-actions-col">
                    <button
                      type="button"
                      className="table-action-icon delete-btn"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove product"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className="btn-text-action text-primary mt-16" onClick={handleAddItem}>
              <PlusIcon size={15} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Right Column: Quotation Summary Card */}
        <div className="content-card quotation-summary-card">
          <h3 className="card-title mb-16">Quotation Summary</h3>

          <div className="summary-line-row">
            <span className="text-secondary">Subtotal</span>
            <span className="font-semibold">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="summary-line-row">
            <span className="text-secondary">Tax (18%)</span>
            <span className="font-semibold">₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-line-row total-row">
            <span className="total-label">Total</span>
            <span className="total-value">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="summary-actions-column mt-24">
            <button
              type="button"
              className="btn btn-primary btn-block btn-lg"
              onClick={() => handleSave(false)}
            >
              Create Quotation
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-block mt-8"
              onClick={onBack}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

