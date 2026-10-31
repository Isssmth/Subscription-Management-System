import React, { useState, useEffect } from 'react';

export function ProductModal({ isOpen, onClose, onSave, product = null }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'SERVICE',
    salesPrice: '',
    costPrice: '',
    notes: '',
    active: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        type: product.type || 'SERVICE',
        salesPrice: product.salesPrice !== undefined ? product.salesPrice : '',
        costPrice: product.costPrice !== undefined ? product.costPrice : '',
        notes: product.notes || '',
        active: product.active !== undefined ? product.active : true,
      });
    } else {
      setFormData({
        name: '',
        type: 'SERVICE',
        salesPrice: '',
        costPrice: '',
        notes: '',
        active: true,
      });
    }
    setErrors({});
  }, [product, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Product name is required';
    }
    if (!formData.type) {
      errs.type = 'Product type is required';
    }
    if (formData.salesPrice === '' || isNaN(formData.salesPrice) || Number(formData.salesPrice) < 0) {
      errs.salesPrice = 'Sales price must be a non-negative number';
    }
    if (formData.costPrice === '' || isNaN(formData.costPrice) || Number(formData.costPrice) < 0) {
      errs.costPrice = 'Cost price must be a non-negative number';
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
        name: formData.name.trim(),
        salesPrice: parseFloat(formData.salesPrice),
        costPrice: parseFloat(formData.costPrice),
        notes: formData.notes.trim() || null,
      });
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save product' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <div className="modal-header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button type="button" className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.form && <div className="form-error-banner">{errors.form}</div>}

            <div className="form-group">
              <label htmlFor="product-name">
                Product Name <span className="req">*</span>
              </label>
              <input
                id="product-name"
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Brightloop ERP Suite"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="product-type">
                Product Type <span className="req">*</span>
              </label>
              <select
                id="product-type"
                className={`form-input ${errors.type ? 'input-error' : ''}`}
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="SERVICE">Service</option>
                <option value="GOODS">Goods</option>
                <option value="DIGITAL">Digital</option>
              </select>
              {errors.type && <span className="error-text">{errors.type}</span>}
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="sales-price">
                  Sales Price (₹) <span className="req">*</span>
                </label>
                <input
                  id="sales-price"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input ${errors.salesPrice ? 'input-error' : ''}`}
                  placeholder="0.00"
                  value={formData.salesPrice}
                  onChange={(e) => setFormData({ ...formData, salesPrice: e.target.value })}
                />
                {errors.salesPrice && <span className="error-text">{errors.salesPrice}</span>}
              </div>

              <div className="form-group half">
                <label htmlFor="cost-price">
                  Cost Price (₹) <span className="req">*</span>
                </label>
                <input
                  id="cost-price"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input ${errors.costPrice ? 'input-error' : ''}`}
                  placeholder="0.00"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                />
                {errors.costPrice && <span className="error-text">{errors.costPrice}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="product-notes">Notes & Specifications</label>
              <textarea
                id="product-notes"
                rows="3"
                className="form-input"
                placeholder="Internal notes or product description..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <span>Active Status (Available for plans and subscriptions)</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

