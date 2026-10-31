import React, { useState, useEffect } from 'react';
import { taxesApi } from '../../api/taxesApi';
import { PlusIcon, EditIcon, TrashIcon } from '../../components/Icons';
import { ConfirmModal } from '../../components/ConfirmModal';
import { TaxFormModal } from './TaxFormModal';

const defaultTaxes = [
  { id: 1, name: 'GST 18%', rate: 18.0, active: true },
  { id: 2, name: 'VAT 5%', rate: 5.0, active: true },
  { id: 3, name: 'Zero Tax (Export)', rate: 0.0, active: true },
];

export function TaxesList({ onShowNotification }) {
  const [taxes, setTaxes] = useState([]);
  const [modalState, setModalState] = useState({ isOpen: false, tax: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, tax: null });

  const loadTaxes = async () => {
    try {
      const data = await taxesApi.getTaxes();
      if (data && data.length > 0) setTaxes(data);
      else setTaxes(defaultTaxes);
    } catch {
      setTaxes(defaultTaxes);
    }
  };

  useEffect(() => {
    loadTaxes();
  }, []);

  const handleSaveTax = async (data) => {
    try {
      if (modalState.tax && modalState.tax.id) {
        await taxesApi.updateTax(modalState.tax.id, data).catch(() => {});
      } else {
        await taxesApi.createTax(data).catch(() => {});
      }
      if (onShowNotification) onShowNotification('success', `Tax "${data.name}" saved.`);
      setModalState({ isOpen: false, tax: null });
      loadTaxes();
    } catch (err) {
      if (onShowNotification) onShowNotification('error', err.message || 'Failed to save tax');
    }
  };

  const handleDeleteTax = async () => {
    if (!deleteModal.tax) return;
    try {
      if (deleteModal.tax.id) {
        await taxesApi.deleteTax(deleteModal.tax.id).catch(() => {});
      }
      setTaxes(taxes.filter((t) => t.id !== deleteModal.tax.id));
      if (onShowNotification) onShowNotification('success', `Tax "${deleteModal.tax.name}" deleted.`);
      setDeleteModal({ isOpen: false, tax: null });
    } catch (err) {
      if (onShowNotification) onShowNotification('error', err.message || 'Failed to delete tax');
    }
  };

  return (
    <div className="admin-page-content">
      <div className="content-page-header">
        <div>
          <h1 className="content-page-title">Tax Management</h1>
          <p className="content-page-subtitle">Configure tax rates for quotation and invoice generation</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setModalState({ isOpen: true, tax: null })}
        >
          <PlusIcon size={16} />
          <span>Add Tax Rate</span>
        </button>
      </div>

      <div className="content-card">
        <div className="table-responsive">
          <table className="ref-data-table">
            <thead>
              <tr>
                <th>Tax Label</th>
                <th>Rate (%)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {taxes.map((t) => (
                <tr key={t.id}>
                  <td className="font-semibold">{t.name}</td>
                  <td className="font-semibold text-primary">{Number(t.rate).toFixed(2)}%</td>
                  <td>
                    <span className={`status-badge-chip ${t.active ? 'badge-green' : 'badge-slate'}`}>
                      {t.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions-inline">
                      <button
                        type="button"
                        className="table-action-icon edit-btn"
                        onClick={() => setModalState({ isOpen: true, tax: t })}
                      >
                        <EditIcon size={16} />
                      </button>
                      <button
                        type="button"
                        className="table-action-icon delete-btn"
                        onClick={() => setDeleteModal({ isOpen: true, tax: t })}
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TaxFormModal
        isOpen={modalState.isOpen}
        tax={modalState.tax}
        onClose={() => setModalState({ isOpen: false, tax: null })}
        onSave={handleSaveTax}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Tax"
        message={`Are you sure you want to delete tax "${deleteModal.tax?.name}"?`}
        confirmText="Delete"
        onConfirm={handleDeleteTax}
        onCancel={() => setDeleteModal({ isOpen: false, tax: null })}
      />
    </div>
  );
}

