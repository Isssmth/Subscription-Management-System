import React, { useState, useEffect } from 'react';
import { productsApi } from '../../api/productsApi';

export function PlanFormModal({ isOpen, onClose, onSave, plan = null }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: 1,
    name: 'Pro Plan',
    price: '2000',
    billingFrequency: 'MONTHLY',
    minimumQuantity: 1,
    availabilityStartDate: '2025-01-01',
    availabilityEndDate: '2025-12-31',
    autoClose: false,
    earlyClosure: true,
    pause: true,
    renewal: true,
    active: true,
  });

  useEffect(() => {
    if (isOpen) {
      productsApi.getProducts().then((p) => {
        if (p && p.length > 0) setProducts(p);
      }).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (plan) {
      setFormData({
        productId: plan.productId || 1,
        name: plan.name || '',
        price: plan.price !== undefined ? String(plan.price) : '',
        billingFrequency: plan.billingFrequency ? plan.billingFrequency.toUpperCase() : 'MONTHLY',
        minimumQuantity: plan.minimumQuantity || 1,
        availabilityStartDate: plan.availabilityStartDate || '2025-01-01',
        availabilityEndDate: plan.availabilityEndDate || '2025-12-31',
        autoClose: plan.autoClose || false,
        earlyClosure: plan.earlyClosure !== undefined ? plan.earlyClosure : true,
        pause: plan.pause !== undefined ? plan.pause : true,
        renewal: plan.renewal !== undefined ? plan.renewal : true,
        active: plan.active !== undefined ? plan.active : true,
      });
    }
  }, [plan, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      productId: Number(formData.productId) || 1,
      price: parseFloat(formData.price) || 0,
      minimumQuantity: parseInt(formData.minimumQuantity, 10) || 1,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog modal-lg">
        <div className="modal-header">
          <h3 className="modal-title font-bold">{plan ? 'Edit Plan' : 'Add Subscription Plan'}</h3>
          <button type="button" className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row-2col">
              <div className="form-group">
                <label className="field-label">Plan Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Pro Plan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="field-label">Associated Product</label>
                <select
                  className="form-input"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                >
                  {products.length > 0 ? (
                    products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))
                  ) : (
                    <option value="1">Odoo Software</option>
                  )}
                </select>
              </div>
            </div>

            <div className="form-row-3col">
              <div className="form-group">
                <label className="field-label">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="2000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="field-label">Frequency *</label>
                <select
                  className="form-input"
                  value={formData.billingFrequency}
                  onChange={(e) => setFormData({ ...formData, billingFrequency: e.target.value })}
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">Min Quantity *</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.minimumQuantity}
                  onChange={(e) => setFormData({ ...formData, minimumQuantity: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="field-label">Start Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.availabilityStartDate}
                  onChange={(e) => setFormData({ ...formData, availabilityStartDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="field-label">End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.availabilityEndDate}
                  onChange={(e) => setFormData({ ...formData, availabilityEndDate: e.target.value })}
                />
              </div>
            </div>

            {/* Lifecycle Rules Flags */}
            <div className="sub-switches-box">
              <span className="field-label mb-8">Plan Lifecycle Rules</span>
              <div className="switches-grid">
                <label className="switch-label">
                  <input
                    type="checkbox"
                    checked={formData.earlyClosure}
                    onChange={(e) => setFormData({ ...formData, earlyClosure: e.target.checked })}
                  />
                  <span>Allow Early Closure</span>
                </label>
                <label className="switch-label">
                  <input
                    type="checkbox"
                    checked={formData.pause}
                    onChange={(e) => setFormData({ ...formData, pause: e.target.checked })}
                  />
                  <span>Allow Pause & Resume</span>
                </label>
                <label className="switch-label">
                  <input
                    type="checkbox"
                    checked={formData.renewal}
                    onChange={(e) => setFormData({ ...formData, renewal: e.target.checked })}
                  />
                  <span>Auto Renewal</span>
                </label>
                <label className="switch-label">
                  <input
                    type="checkbox"
                    checked={formData.autoClose}
                    onChange={(e) => setFormData({ ...formData, autoClose: e.target.checked })}
                  />
                  <span>Auto Close on Expiry</span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {plan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

