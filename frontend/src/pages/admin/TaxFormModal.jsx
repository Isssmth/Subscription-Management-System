import React, { useState, useEffect } from 'react';

export function TaxFormModal({ isOpen, onClose, onSave, tax = null }) {
  const [formData, setFormData] = useState({
    name: 'GST 18%',
    rate: '18.00',
    active: true,
  });

  useEffect(() => {
    if (tax) {
      setFormData({
        name: tax.name || '',
        rate: tax.rate !== undefined ? String(tax.rate) : '',
        active: tax.active !== undefined ? tax.active : true,
      });
    } else {
      setFormData({
        name: '',
        rate: '',
        active: true,
      });
    }
  }, [tax, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: formData.name.trim(),
      rate: parseFloat(formData.rate) || 0,
      active: formData.active,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <div className="modal-header">
          <h3 className="modal-title font-bold">{tax ? 'Edit Tax Rate' : 'Add Tax Rate'}</h3>
          <button type="button" className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="field-label">Tax Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. GST 18%"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="field-label">Tax Rate (%) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                className="form-input"
                placeholder="18.00"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                required
              />
            </div>

            <div className="form-group mt-12">
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <span>Active Status (Available for invoices)</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Tax
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

