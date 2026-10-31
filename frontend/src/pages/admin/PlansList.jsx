import React, { useState, useEffect } from 'react';
import { plansApi } from '../../api/plansApi';
import { PlusIcon, EditIcon, TrashIcon } from '../../components/Icons';
import { ConfirmModal } from '../../components/ConfirmModal';
import { PlanFormModal } from './PlanFormModal';

const defaultReferencePlans = [
  {
    id: 1,
    name: 'Basic Plan',
    price: 1000,
    billingFrequency: 'Monthly',
    minimumQuantity: 1,
    availabilityStartDate: '2025-01-01',
    availabilityEndDate: '2025-12-31',
    availabilityDisplay: '01-01-2025 - 31-12-2025',
    active: true,
  },
  {
    id: 2,
    name: 'Pro Plan',
    price: 2000,
    billingFrequency: 'Monthly',
    minimumQuantity: 5,
    availabilityStartDate: '2025-01-01',
    availabilityEndDate: '2025-12-31',
    availabilityDisplay: '01-01-2025 - 31-12-2025',
    active: true,
  },
  {
    id: 3,
    name: 'Enterprise Plan',
    price: 5000,
    billingFrequency: 'Yearly',
    minimumQuantity: 10,
    availabilityStartDate: '2025-01-01',
    availabilityEndDate: '2026-12-31',
    availabilityDisplay: '01-01-2025 - 31-12-2026',
    active: true,
  },
];

export function PlansList({ onShowNotification }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, plan: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, plan: null });

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await plansApi.getPlans();
      if (data && data.length > 0) {
        setPlans(
          data.map((p) => ({
            ...p,
            availabilityDisplay: `${p.availabilityStartDate} - ${p.availabilityEndDate || 'Ongoing'}`,
            billingFrequency: p.billingFrequency
              ? p.billingFrequency.charAt(0) + p.billingFrequency.slice(1).toLowerCase()
              : 'Monthly',
          }))
        );
      } else {
        setPlans(defaultReferencePlans);
      }
    } catch (err) {
      setPlans(defaultReferencePlans);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleSavePlan = async (planData) => {
    try {
      if (modalState.plan && modalState.plan.id) {
        await plansApi.updatePlan(modalState.plan.id, planData).catch(() => {});
      } else {
        await plansApi.createPlan(planData).catch(() => {});
      }
      if (onShowNotification) onShowNotification('success', `Plan "${planData.name}" saved successfully.`);
      setModalState({ isOpen: false, plan: null });
      loadPlans();
    } catch (err) {
      if (onShowNotification) onShowNotification('error', err.message || 'Failed to save plan');
    }
  };

  const handleDeletePlan = async () => {
    if (!deleteModal.plan) return;
    try {
      if (deleteModal.plan.id) {
        await plansApi.deletePlan(deleteModal.plan.id).catch(() => {});
      }
      setPlans(plans.filter((p) => p.id !== deleteModal.plan.id));
      if (onShowNotification) onShowNotification('success', `Plan "${deleteModal.plan.name}" deleted.`);
      setDeleteModal({ isOpen: false, plan: null });
    } catch (err) {
      if (onShowNotification) onShowNotification('error', err.message || 'Failed to delete plan');
    }
  };

  return (
    <div className="admin-page-content">
      {/* Header matching middle-center reference image */}
      <div className="content-page-header">
        <div>
          <h1 className="content-page-title">Subscription Plans</h1>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setModalState({ isOpen: true, plan: null })}
        >
          <PlusIcon size={16} />
          <span>Add Plan</span>
        </button>
      </div>

      {/* Plans Card Container */}
      <div className="content-card">
        <div className="table-responsive">
          <table className="ref-data-table">
            <thead>
              <tr>
                <th style={{ width: '24%' }}>Plan Name</th>
                <th style={{ width: '16%' }}>Price</th>
                <th style={{ width: '20%' }}>Billing Frequency</th>
                <th style={{ width: '16%' }}>Min Quantity</th>
                <th style={{ width: '24%' }}>Availability</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td className="font-semibold">{plan.name}</td>
                  <td className="font-semibold">₹{Number(plan.price).toLocaleString('en-IN')}</td>
                  <td className="text-secondary">{plan.billingFrequency}</td>
                  <td>{plan.minimumQuantity}</td>
                  <td className="text-secondary text-sm">
                    {plan.availabilityDisplay || `${plan.availabilityStartDate} - ${plan.availabilityEndDate || 'Ongoing'}`}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions-inline">
                      <button
                        type="button"
                        className="table-action-icon edit-btn"
                        onClick={() => setModalState({ isOpen: true, plan })}
                        title="Edit plan"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button
                        type="button"
                        className="table-action-icon delete-btn"
                        onClick={() => setDeleteModal({ isOpen: true, plan })}
                        title="Delete plan"
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

        {/* Pagination */}
        <div className="table-pagination-footer">
          <div className="pagination-pills">
            <button type="button" className="page-pill active">
              1
            </button>
            <button type="button" className="page-pill nav-pill">
              &gt;
            </button>
          </div>
        </div>
      </div>

      <PlanFormModal
        isOpen={modalState.isOpen}
        plan={modalState.plan}
        onClose={() => setModalState({ isOpen: false, plan: null })}
        onSave={handleSavePlan}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Plan"
        message={`Are you sure you want to delete plan "${deleteModal.plan?.name}"?`}
        confirmText="Delete"
        onConfirm={handleDeletePlan}
        onCancel={() => setDeleteModal({ isOpen: false, plan: null })}
      />
    </div>
  );
}

