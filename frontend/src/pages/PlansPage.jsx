import React, { useState, useEffect } from 'react';
import { plansApi } from '../api/plansApi';
import { productsApi } from '../api/productsApi';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ConfirmModal } from '../components/ConfirmModal';
import { PlanModal } from './PlanModal';

export function PlansPage({ initialProductId = null, onShowNotification }) {
  const [plans, setPlans] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    productId: initialProductId || '',
    frequency: '',
    active: '',
    query: '',
  });

  // Modals
  const [modalState, setModalState] = useState({ isOpen: false, plan: null, defaultProductId: initialProductId });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, plan: null });

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansData, prodsData] = await Promise.all([
        plansApi.getPlans(filters),
        productsApi.getProducts(),
      ]);
      setPlans(plansData || []);
      setProducts(prodsData || []);
    } catch (err) {
      onShowNotification('error', err.message || 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleSavePlan = async (planData) => {
    if (modalState.plan) {
      await plansApi.updatePlan(modalState.plan.id, planData);
      onShowNotification('success', `Plan "${planData.name}" updated successfully.`);
    } else {
      await plansApi.createPlan(planData);
      onShowNotification('success', `Plan "${planData.name}" created successfully.`);
    }
    await loadData();
  };

  const handleToggleStatus = async (plan) => {
    try {
      const updated = await plansApi.toggleStatus(plan.id);
      onShowNotification(
        'success',
        `Plan "${plan.name}" marked as ${updated.active ? 'active' : 'inactive'}.`
      );
      await loadData();
    } catch (err) {
      onShowNotification('error', err.message || 'Failed to update plan status');
    }
  };

  const handleDeletePlan = async () => {
    if (!deleteModal.plan) return;
    try {
      await plansApi.deletePlan(deleteModal.plan.id);
      onShowNotification('success', `Plan "${deleteModal.plan.name}" deleted successfully.`);
      setDeleteModal({ isOpen: false, plan: null });
      await loadData();
    } catch (err) {
      onShowNotification('error', err.message || 'Failed to delete plan');
    }
  };

  return (
    <div className="module-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>Billing Plans Management</h2>
          <p className="page-subtext">
            Configure subscription frequencies, minimum order quantities, validity windows, and renewal terms.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setModalState({ isOpen: true, plan: null, defaultProductId: filters.productId || null })}
        >
          + Add Plan
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group search-group">
          <input
            type="text"
            className="filter-input"
            placeholder="Search plans by name..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.productId}
            onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.frequency}
            onChange={(e) => setFilters({ ...filters, frequency: e.target.value })}
          >
            <option value="">All Frequencies</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.active}
            onChange={(e) => setFilters({ ...filters, active: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>

        {(filters.query || filters.productId || filters.frequency || filters.active !== '') && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setFilters({ query: '', productId: '', frequency: '', active: '' })}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Fetching billing plans..." />
      ) : plans.length === 0 ? (
        <EmptyState
          title="No billing plans found"
          description={
            filters.query || filters.productId || filters.frequency || filters.active !== ''
              ? 'No plans matched your filter criteria.'
              : 'Configure your first product subscription plan.'
          }
          actionText="+ Create Plan"
          onAction={() => setModalState({ isOpen: true, plan: null, defaultProductId: null })}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Product</th>
                <th>Price / Frequency</th>
                <th>Min Qty</th>
                <th>Validity Window</th>
                <th>Capabilities</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td>
                    <div className="product-cell">
                      <span className="font-semibold">{plan.name}</span>
                      <span className="text-muted text-xs">ID #{plan.id}</span>
                    </div>
                  </td>
                  <td>
                    <span className="product-tag">{plan.productName || `Product #${plan.productId}`}</span>
                  </td>
                  <td>
                    <div className="plan-price-cell">
                      <span className="font-mono font-semibold">
                        ₹{Number(plan.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <Badge variant="frequency" text={plan.billingFrequency} />
                    </div>
                  </td>
                  <td>{plan.minimumQuantity}</td>
                  <td>
                    <div className="text-xs">
                      <div>Start: {plan.availabilityStartDate}</div>
                      {plan.availabilityEndDate ? (
                        <div className="text-muted">End: {plan.availabilityEndDate}</div>
                      ) : (
                        <div className="text-success">Ongoing</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="capabilities-tags">
                      {plan.autoClose && <span className="cap-pill" title="Auto-close on expiration">AutoClose</span>}
                      {plan.earlyClosure && <span className="cap-pill" title="Early closure permitted">EarlyClose</span>}
                      {plan.pause && <span className="cap-pill" title="Pause allowed">Pause</span>}
                      {plan.renewal && <span className="cap-pill cap-renewal" title="Auto renewal">Renewal</span>}
                    </div>
                  </td>
                  <td>
                    <span
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(plan)}
                      title="Click to toggle status"
                    >
                      <Badge type={plan.active} />
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="action-buttons-group">
                      <button
                        type="button"
                        className="action-btn text-primary"
                        onClick={() => setModalState({ isOpen: true, plan, defaultProductId: null })}
                        title="Edit plan"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="action-btn text-danger"
                        onClick={() => setDeleteModal({ isOpen: true, plan })}
                        title="Delete plan"
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

      {/* Plan Modal */}
      <PlanModal
        isOpen={modalState.isOpen}
        plan={modalState.plan}
        defaultProductId={modalState.defaultProductId}
        onClose={() => setModalState({ isOpen: false, plan: null, defaultProductId: null })}
        onSave={handleSavePlan}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Plan"
        message={`Are you sure you want to remove plan "${deleteModal.plan?.name}"? Existing quotations referencing this plan may be affected.`}
        confirmText="Delete Plan"
        onConfirm={handleDeletePlan}
        onCancel={() => setDeleteModal({ isOpen: false, plan: null })}
      />
    </div>
  );
}

