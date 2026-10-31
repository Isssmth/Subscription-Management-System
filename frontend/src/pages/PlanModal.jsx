import React, { useState, useEffect } from 'react';
import { productsApi } from '../api/productsApi';

export function PlanModal({ isOpen, onClose, onSave, plan = null, defaultProductId = null }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    price: '',
    billingFrequency: 'MONTHLY',
    minimumQuantity: 1,
    availabilityStartDate: new Date().toISOString().split('T')[0],
    availabilityEndDate: '',
    autoClose: false,
    earlyClosure: false,
    pause: false,
    renewal: true,
    active: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load products list for dropdown
  useEffect(() => {
    if (!isOpen) return;
    const fetchProds = async () => {
      try {
        setLoadingProducts(true);
        const data = await productsApi.getProducts();
        setProducts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProds();
  }, [isOpen]);

  useEffect(() => {
    if (plan) {
      setFormData({
        productId: plan.productId || '',
        name: plan.name || '',
        price: plan.price !== undefined ? plan.price : '',
        billingFrequency: plan.billingFrequency || 'MONTHLY',
        minimumQuantity: plan.minimumQuantity || 1,
        availabilityStartDate: plan.availabilityStartDate || '',
        availabilityEndDate: plan.availabilityEndDate || '',
        autoClose: plan.autoClose || false,
        earlyClosure: plan.earlyClosure || false,
        pause: plan.pause || false,
        renewal: plan.renewal !== undefined ? plan.renewal : true,
        active: plan.active !== undefined ? plan.active : true,
      });
    } else {
      setFormData({
        productId: defaultProductId || '',
        name: '',
        price: '',
        billingFrequency: 'MONTHLY',
        minimumQuantity: 1,
        availabilityStartDate: new Date().toISOString().split('T')[0],
        availabilityEndDate: '',
        autoClose: false,
        earlyClosure: false,
        pause: false,
        renewal: true,
        active: true,
      });
    }
    setErrors({});
  }, [plan, defaultProductId, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.productId) {
      errs.productId = 'Product association is required';
    }
    if (!formData.name.trim()) {
      errs.name = 'Plan name is required';
    }
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      errs.price = 'Price must be a non-negative number';
    }
    if (!formData.billingFrequency) {
      errs.billingFrequency = 'Billing frequency is required';
    }
    if (!formData.minimumQuantity || isNaN(formData.minimumQuantity) || Number(formData.minimumQuantity) < 1) {
      errs.minimumQuantity = 'Minimum quantity must be at least 1';
    }
    if (!formData.availabilityStartDate) {
      errs.availabilityStartDate = 'Availability start date is required';
    }
    if (formData.availabilityStartDate && formData.availabilityEndDate) {
      if (new Date(formData.availabilityEndDate) < new Date(formData.availabilityStartDate)) {
        errs.availabilityEndDate = 'End date cannot be earlier than start date';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSave({
        ...formData,
        productId: Number(formData.productId),
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        minimumQuantity: parseInt(formData.minimumQuantity, 10),
        availabilityEndDate: formData.availabilityEndDate || null,
      });
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save plan' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog modal-lg">
        <div className="modal-header">
          <h3>{plan ? 'Edit Plan' : 'Add New Billing Plan'}</h3>
          <button type="button" className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.form && <div className="form-error-banner">{errors.form}</div>}

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="plan-product">
                  Associated Product <span className="req">*</span>
                </label>
                <select
                  id="plan-product"
                  className={`form-input ${errors.productId ? 'input-error' : ''}`}
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  disabled={loadingProducts}
                >
                  <option value="">-- Select Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Base: ₹{p.salesPrice})
                    </option>
                  ))}
                </select>
                {errors.productId && <span className="error-text">{errors.productId}</span>}
              </div>

              <div className="form-group half">
                <label htmlFor="plan-name">
                  Plan Name <span className="req">*</span>
                </label>
                <input
                  id="plan-name"
                  type="text"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="e.g. Monthly Standard, Annual Pro"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group third">
                <label htmlFor="plan-price">
                  Plan Price (₹) <span className="req">*</span>
                </label>
                <input
                  id="plan-price"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input ${errors.price ? 'input-error' : ''}`}
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                {errors.price && <span className="error-text">{errors.price}</span>}
              </div>

              <div className="form-group third">
                <label htmlFor="plan-frequency">
                  Billing Frequency <span className="req">*</span>
                </label>
                <select
                  id="plan-frequency"
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

              <div className="form-group third">
                <label htmlFor="plan-quantity">
                  Minimum Quantity <span className="req">*</span>
                </label>
                <input
                  id="plan-quantity"
                  type="number"
                  min="1"
                  className={`form-input ${errors.minimumQuantity ? 'input-error' : ''}`}
                  value={formData.minimumQuantity}
                  onChange={(e) => setFormData({ ...formData, minimumQuantity: e.target.value })}
                />
                {errors.minimumQuantity && <span className="error-text">{errors.minimumQuantity}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="start-date">
                  Availability Start Date <span className="req">*</span>
                </label>
                <input
                  id="start-date"
                  type="date"
                  className={`form-input ${errors.availabilityStartDate ? 'input-error' : ''}`}
                  value={formData.availabilityStartDate}
                  onChange={(e) => setFormData({ ...formData, availabilityStartDate: e.target.value })}
                />
                {errors.availabilityStartDate && <span className="error-text">{errors.availabilityStartDate}</span>}
              </div>

              <div className="form-group half">
                <label htmlFor="end-date">Availability End Date (Optional)</label>
                <input
                  id="end-date"
                  type="date"
                  className={`form-input ${errors.availabilityEndDate ? 'input-error' : ''}`}
                  value={formData.availabilityEndDate}
                  onChange={(e) => setFormData({ ...formData, availabilityEndDate: e.target.value })}
                />
                {errors.availabilityEndDate && <span className="error-text">{errors.availabilityEndDate}</span>}
              </div>
            </div>

            {/* Plan Capabilities Flags */}
            <div className="plan-flags-box">
              <span className="flags-box-title">Subscription Lifecycle Rules</span>
              <div className="flags-grid">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.autoClose}
                    onChange={(e) => setFormData({ ...formData, autoClose: e.target.checked })}
                  />
                  <span>Auto-close on expiration</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.earlyClosure}
                    onChange={(e) => setFormData({ ...formData, earlyClosure: e.target.checked })}
                  />
                  <span>Allow early closure / cancellation</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.pause}
                    onChange={(e) => setFormData({ ...formData, pause: e.target.checked })}
                  />
                  <span>Allow pause & resume</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.renewal}
                    onChange={(e) => setFormData({ ...formData, renewal: e.target.checked })}
                  />
                  <span>Automatic renewal enabled</span>
                </label>
              </div>
            </div>

            <div className="form-group checkbox-group mt-16">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <span>Active Status (Ready to subscribe in Quotations module)</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : plan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

