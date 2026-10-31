import React, { useState, useEffect } from 'react';

export function TaxModal({ isOpen, onClose, onSave, tax = null }) {
  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    active: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (tax) {
      setFormData({
        name: tax.name || '',
        rate: tax.rate !== undefined ? tax.rate : '',
        active: tax.active !== undefined ? tax.active : true,
      });
    } else {
      setFormData({
        name: '',
        rate: '',
        active: true,
      });
    }
    setErrors({});
  }, [tax, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Tax name is required';
    }
    if (formData.rate === '' || isNaN(formData.rate)) {
      errs.rate = 'Tax rate is required';
    } else {
      const numRate = Number(formData.rate);
      if (numRate < 0 || numRate > 100) {
        errs.rate = 'Tax rate must be between 0.00% and 100.00%';
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
        name: formData.name.trim(),
        rate: parseFloat(formData.rate),
      });
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save tax' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <div className="modal-header">
          <h3>{tax ? 'Edit Tax Record' : 'Configure New Tax'}</h3>
          <button type="button" className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.form && <div className="form-error-banner">{errors.form}</div>}

            <div className="form-group">
              <label htmlFor="tax-name">
                Tax Label / Name <span className="req">*</span>
              </label>
              <input
                id="tax-name"
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. GST 18%, VAT 5%, State Sales Tax"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="tax-rate">
                Tax Rate (%) <span className="req">*</span>
              </label>
              <input
                id="tax-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                className={`form-input ${errors.rate ? 'input-error' : ''}`}
                placeholder="18.00"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
              />
              {errors.rate && <span className="error-text">{errors.rate}</span>}
              <span className="field-hint">Configured rate ready for Billing module invoice calculations.</span>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <span>Active Status (Available for invoice generation)</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : tax ? 'Update Tax' : 'Save Tax'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

