import React, { useState, useEffect } from 'react';
import { taxesApi } from '../api/taxesApi';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ConfirmModal } from '../components/ConfirmModal';
import { TaxModal } from './TaxModal';

export function TaxesPage({ onShowNotification }) {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOnly, setActiveOnly] = useState(false);

  // Modals
  const [modalState, setModalState] = useState({ isOpen: false, tax: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, tax: null });

  const loadTaxes = async () => {
    try {
      setLoading(true);
      const data = await taxesApi.getTaxes(activeOnly);
      setTaxes(data || []);
    } catch (err) {
      onShowNotification('error', err.message || 'Failed to load taxes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaxes();
  }, [activeOnly]);

  const handleSaveTax = async (taxData) => {
    if (modalState.tax) {
      await taxesApi.updateTax(modalState.tax.id, taxData);
      onShowNotification('success', `Tax "${taxData.name}" updated successfully.`);
    } else {
      await taxesApi.createTax(taxData);
      onShowNotification('success', `Tax "${taxData.name}" created successfully.`);
    }
    await loadTaxes();
  };

  const handleToggleStatus = async (tax) => {
    try {
      const updated = await taxesApi.toggleStatus(tax.id);
      onShowNotification(
        'success',
        `Tax "${tax.name}" marked as ${updated.active ? 'active' : 'inactive'}.`
      );
      await loadTaxes();
    } catch (err) {
      onShowNotification('error', err.message || 'Failed to update tax status');
    }
  };

  const handleDeleteTax = async () => {
    if (!deleteModal.tax) return;
    try {
      await taxesApi.deleteTax(deleteModal.tax.id);
      onShowNotification('success', `Tax "${deleteModal.tax.name}" deleted.`);
      setDeleteModal({ isOpen: false, tax: null });
      await loadTaxes();
    } catch (err) {
      onShowNotification('error', err.message || 'Failed to delete tax');
    }
  };

  return (
    <div className="module-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>Tax Management</h2>
          <p className="page-subtext">
            Configure system tax rates. Tax definitions are exposed via API for the Billing module during invoice generation.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setModalState({ isOpen: true, tax: null })}
        >
          + Configure Tax
        </button>
      </div>

      {/* Integration Notice */}
      <div className="info-banner">
        <span className="info-banner-icon">ℹ️</span>
        <div>
          <strong>Billing Integration Boundary:</strong> Tax records created here are served to the Billing module via <code>/api/taxes</code>. Invoice tax arithmetic is owned by Billing.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
            />
            <span>Show Active Taxes Only</span>
          </label>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Fetching taxes..." />
      ) : taxes.length === 0 ? (
        <EmptyState
          title="No tax configurations found"
          description={
            activeOnly
              ? 'No active tax records found.'
              : 'Add your first tax rate (e.g. GST 18%, VAT 5%).'
          }
          actionText="+ Configure Tax"
          onAction={() => setModalState({ isOpen: true, tax: null })}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tax Label</th>
                <th>Rate (%)</th>
                <th>Status</th>
                <th>Configured On</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {taxes.map((t) => (
                <tr key={t.id}>
                  <td>
                    <span className="font-semibold">{t.name}</span>
                  </td>
                  <td>
                    <span className="font-mono font-bold text-primary">
                      {Number(t.rate).toFixed(2)}%
                    </span>
                  </td>
                  <td>
                    <span
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(t)}
                      title="Click to toggle status"
                    >
                      <Badge type={t.active} />
                    </span>
                  </td>
                  <td className="text-muted text-xs">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="action-buttons-group">
                      <button
                        type="button"
                        className="action-btn text-primary"
                        onClick={() => setModalState({ isOpen: true, tax: t })}
                        title="Edit tax"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="action-btn text-danger"
                        onClick={() => setDeleteModal({ isOpen: true, tax: t })}
                        title="Delete tax"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Tax Modal */}
      <TaxModal
        isOpen={modalState.isOpen}
        tax={modalState.tax}
        onClose={() => setModalState({ isOpen: false, tax: null })}
        onSave={handleSaveTax}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Tax"
        message={`Are you sure you want to delete tax "${deleteModal.tax?.name}"? Billing invoices relying on this rate may be affected.`}
        confirmText="Delete Tax"
        onConfirm={handleDeleteTax}
        onCancel={() => setDeleteModal({ isOpen: false, tax: null })}
      />
    </div>
  );
}

