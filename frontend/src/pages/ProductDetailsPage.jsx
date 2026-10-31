import React, { useState, useEffect } from 'react';
import { productsApi } from '../api/productsApi';
import { plansApi } from '../api/plansApi';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ConfirmModal } from '../components/ConfirmModal';

export function ProductDetailsPage({ productId, onBack, onNavigateToPlans, onShowNotification }) {
  const [product, setProduct] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Variant form state
  const [variantForm, setVariantForm] = useState({ name: '', additionalPrice: '' });
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [variantSubmitting, setVariantSubmitting] = useState(false);
  const [variantError, setVariantError] = useState('');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, variantId: null, variantName: '' });

  // Live Price Calculator state
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodData, plansData] = await Promise.all([
        productsApi.getProductById(productId),
        plansApi.getPlans({ productId }),
      ]);
      setProduct(prodData);
      setPlans(plansData || []);
    } catch (err) {
      onShowNotification('error', err.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [productId]);

  // Recalculate price when selection changes
  useEffect(() => {
    if (!product) return;
    const computePrice = async () => {
      try {
        setCalculating(true);
        const res = await productsApi.calculatePrice(productId, selectedVariants);
        setCalculatedPrice(res);
      } catch (err) {
        // Fallback local computation if network glitch
        const base = Number(product.salesPrice) || 0;
        const addition = (product.variants || [])
          .filter((v) => selectedVariants.includes(v.id))
          .reduce((sum, v) => sum + (Number(v.additionalPrice) || 0), 0);
        setCalculatedPrice({
          baseSalesPrice: base,
          totalVariantAddition: addition,
          finalPrice: base + addition,
        });
      } finally {
        setCalculating(false);
      }
    };
    computePrice();
  }, [selectedVariants, product]);

  const handleSaveVariant = async (e) => {
    e.preventDefault();
    setVariantError('');

    if (!variantForm.name.trim()) {
      setVariantError('Variant name is required');
      return;
    }
    const addPrice = parseFloat(variantForm.additionalPrice);
    if (isNaN(addPrice) || addPrice < 0) {
      setVariantError('Additional price must be non-negative');
      return;
    }

    try {
      setVariantSubmitting(true);
      if (editingVariantId) {
        await productsApi.updateVariant(productId, editingVariantId, {
          name: variantForm.name.trim(),
          additionalPrice: addPrice,
        });
        onShowNotification('success', 'Variant updated successfully');
      } else {
        await productsApi.createVariant(productId, {
          name: variantForm.name.trim(),
          additionalPrice: addPrice,
        });
        onShowNotification('success', 'Variant added successfully');
      }
      setVariantForm({ name: '', additionalPrice: '' });
      setEditingVariantId(null);
      await loadData();
    } catch (err) {
      setVariantError(err.message || 'Failed to save variant');
    } finally {
      setVariantSubmitting(false);
    }
  };

  const handleEditVariant = (variant) => {
    setEditingVariantId(variant.id);
    setVariantForm({
      name: variant.name,
      additionalPrice: variant.additionalPrice,
    });
    setVariantError('');
  };

  const handleCancelVariantEdit = () => {
    setEditingVariantId(null);
    setVariantForm({ name: '', additionalPrice: '' });
    setVariantError('');
  };

  const handleDeleteVariant = async () => {
    try {
      await productsApi.deleteVariant(productId, deleteModal.variantId);
      onShowNotification('success', `Variant "${deleteModal.variantName}" deleted.`);
      setSelectedVariants((prev) => prev.filter((id) => id !== deleteModal.variantId));
      setDeleteModal({ isOpen: false, variantId: null, variantName: '' });
      await loadData();
    } catch (err) {
      onShowNotification('error', err.message || 'Failed to delete variant');
    }
  };

  const toggleVariantSelection = (variantId) => {
    setSelectedVariants((prev) =>
      prev.includes(variantId) ? prev.filter((id) => id !== variantId) : [...prev, variantId]
    );
  };

  if (loading) return <LoadingSpinner message="Loading product details..." />;
  if (!product) return <div className="error-view">Product not found.</div>;

  const margin = product.salesPrice - product.costPrice;
  const marginPercent =
    product.costPrice > 0 ? ((margin / product.costPrice) * 100).toFixed(1) : '100.0';

  return (
    <div className="product-details-container">
      {/* Top Header & Breadcrumb */}
      <div className="details-header">
        <button type="button" className="btn btn-outline" onClick={onBack}>
          &larr; Back to Products
        </button>
        <div className="header-status">
          <Badge type={product.active} />
          <Badge type={product.type} />
        </div>
      </div>

      {/* Main Info Card */}
      <div className="details-card">
        <div className="details-card-top">
          <div>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-id-sub">Product ID: #{product.id}</p>
          </div>
          <div className="pricing-box">
            <span className="price-label">Sales Price</span>
            <span className="price-value">₹{Number(product.salesPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Cost Price</span>
            <span className="detail-value">₹{Number(product.costPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Profit Margin</span>
            <span className="detail-value text-success">
              ₹{margin.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({marginPercent}%)
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Product Type</span>
            <span className="detail-value">{product.type}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Associated Plans</span>
            <span className="detail-value">{plans.length} plan(s)</span>
          </div>
        </div>

        {product.notes && (
          <div className="detail-notes">
            <span className="detail-label">Notes & Specifications</span>
            <p>{product.notes}</p>
          </div>
        )}
      </div>

      {/* Section 2: Product Variants & Interactive Price Calculator */}
      <div className="variants-section">
        <div className="section-header">
          <div>
            <h2>Product Variants</h2>
            <p className="section-subtext">
              Add multiple variants with custom add-on pricing (e.g. Odoo brand variant adds ₹560).
            </p>
          </div>
        </div>

        {/* Variant Add / Edit Form */}
        <form onSubmit={handleSaveVariant} className="variant-form-inline">
          <div className="form-row align-end">
            <div className="form-group flex-2">
              <label htmlFor="variant-name">Variant Name <span className="req">*</span></label>
              <input
                id="variant-name"
                type="text"
                className="form-input"
                placeholder="e.g. Odoo Brand Variant, 100GB Storage, Premium SLA"
                value={variantForm.name}
                onChange={(e) => setVariantForm({ ...variantForm, name: e.target.value })}
              />
            </div>
            <div className="form-group flex-1">
              <label htmlFor="variant-price">Additional Price (₹) <span className="req">*</span></label>
              <input
                id="variant-price"
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="0.00"
                value={variantForm.additionalPrice}
                onChange={(e) => setVariantForm({ ...variantForm, additionalPrice: e.target.value })}
              />
            </div>
            <div className="form-group form-actions">
              <button type="submit" className="btn btn-primary" disabled={variantSubmitting}>
                {variantSubmitting ? 'Saving...' : editingVariantId ? 'Update Variant' : '+ Add Variant'}
              </button>
              {editingVariantId && (
                <button type="button" className="btn btn-secondary" onClick={handleCancelVariantEdit}>
                  Cancel
                </button>
              )}
            </div>
          </div>
          {variantError && <div className="error-text mt-8">{variantError}</div>}
        </form>

        {/* Variants List & Live Calculator */}
        <div className="variants-layout">
          <div className="variants-table-box">
            <h3>Configured Variants ({product.variants?.length || 0})</h3>
            {product.variants && product.variants.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>Select</th>
                    <th>Variant Name</th>
                    <th>Additional Price</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedVariants.includes(v.id)}
                          onChange={() => toggleVariantSelection(v.id)}
                          title="Select to test price calculation"
                        />
                      </td>
                      <td className="font-semibold">{v.name}</td>
                      <td>+₹{Number(v.additionalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="action-btn text-primary"
                          onClick={() => handleEditVariant(v)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="action-btn text-danger"
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              variantId: v.id,
                              variantName: v.name,
                            })
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-subtext">No variants defined yet for this product.</div>
            )}
          </div>

          {/* Interactive Variant Price Calculator */}
          <div className="price-calculator-card">
            <div className="calculator-header">
              <span className="calc-badge">Price Calculator</span>
              <h4>Live Pricing Breakdown</h4>
            </div>
            <p className="calculator-hint">
              Select variants in the table to see calculated final price (Product Sales Price + Selected Variants).
            </p>

            <div className="calc-row">
              <span>Base Product Price:</span>
              <span className="font-mono">₹{Number(product.salesPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="calc-row">
              <span>Selected Variants ({selectedVariants.length}):</span>
              <span className="font-mono text-primary">
                +₹{(calculatedPrice?.totalVariantAddition || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="calc-divider" />

            <div className="calc-row calc-total">
              <span>Total Calculated Price:</span>
              <span className="font-mono total-amount">
                {calculating ? '...' : `₹${(calculatedPrice?.finalPrice || product.salesPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              </span>
            </div>

            {selectedVariants.length > 0 && (
              <div className="calc-applied-list">
                <span className="applied-label">Applied:</span>
                {(product.variants || [])
                  .filter((v) => selectedVariants.includes(v.id))
                  .map((v) => (
                    <span key={v.id} className="applied-pill">
                      {v.name} (+₹{v.additionalPrice})
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Associated Plans */}
      <div className="plans-section">
        <div className="section-header">
          <div>
            <h2>Associated Plans ({plans.length})</h2>
            <p className="section-subtext">Billing plans currently configured for this product.</p>
          </div>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => onNavigateToPlans(productId)}
          >
            Manage Plans for this Product &rarr;
          </button>
        </div>

        {plans.length > 0 ? (
          <div className="plans-mini-grid">
            {plans.map((plan) => (
              <div key={plan.id} className="plan-mini-card">
                <div className="plan-mini-header">
                  <h4>{plan.name}</h4>
                  <Badge type={plan.active} />
                </div>
                <div className="plan-mini-price">
                  ₹{Number(plan.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  <span className="plan-freq">/{plan.billingFrequency.toLowerCase()}</span>
                </div>
                <div className="plan-mini-meta">
                  <span>Min Qty: {plan.minimumQuantity}</span>
                  <span>Start: {plan.availabilityStartDate}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-subtext">
            No plans configured yet for this product. Use the Plans tab or button above to create one.
          </div>
        )}
      </div>

      {/* Delete Variant Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Variant"
        message={`Are you sure you want to remove variant "${deleteModal.variantName}"? This action cannot be undone.`}
        confirmText="Delete Variant"
        onConfirm={handleDeleteVariant}
        onCancel={() => setDeleteModal({ isOpen: false, variantId: null, variantName: '' })}
      />
    </div>
  );
}

