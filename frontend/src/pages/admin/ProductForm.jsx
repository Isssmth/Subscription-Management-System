import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, UploadCloudIcon, PlusIcon, EditIcon, TrashIcon } from '../../components/Icons';
import { productsApi } from '../../api/productsApi';

export function ProductForm({ product = null, onBack, onSaveSuccess, onShowNotification }) {
  const [formData, setFormData] = useState({
    name: 'Odoo Software',
    type: 'SERVICE',
    displayType: 'Software',
    salesPrice: '5000',
    costPrice: '3000',
    notes: 'Business management software',
    active: true,
  });

  const [variants, setVariants] = useState([
    { id: 101, name: 'Odoo Brand', additionalPrice: 560 },
  ]);

  const [showAddVariant, setShowAddVariant] = useState(false);
  const [variantInput, setVariantInput] = useState({ name: '', additionalPrice: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        type: product.type || 'SERVICE',
        displayType: product.displayType || 'Software',
        salesPrice: product.salesPrice !== undefined ? String(product.salesPrice) : '',
        costPrice: product.costPrice !== undefined ? String(product.costPrice) : '',
        notes: product.notes || '',
        active: product.active !== undefined ? product.active : true,
      });

      if (product.variants && product.variants.length > 0) {
        setVariants(product.variants);
      } else if (product.id) {
        productsApi.getVariants(product.id).then((v) => {
          if (v && v.length > 0) setVariants(v);
        }).catch(() => {});
      }
    }
  }, [product]);

  const handleAddVariant = () => {
    if (!variantInput.name.trim()) return;
    const price = parseFloat(variantInput.additionalPrice) || 0;
    const newVar = {
      id: Date.now(),
      name: variantInput.name.trim(),
      additionalPrice: price,
    };
    setVariants([...variants, newVar]);
    setVariantInput({ name: '', additionalPrice: '' });
    setShowAddVariant(false);
  };

  const handleDeleteVariant = (id) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        type: formData.type,
        salesPrice: parseFloat(formData.salesPrice) || 0,
        costPrice: parseFloat(formData.costPrice) || 0,
        notes: formData.notes.trim(),
        active: formData.active,
      };

      let savedProduct;
      if (product && product.id) {
        savedProduct = await productsApi.updateProduct(product.id, payload).catch(() => ({ ...product, ...payload }));
      } else {
        savedProduct = await productsApi.createProduct(payload).catch(() => ({ id: Date.now(), ...payload }));
      }

      if (onShowNotification) {
        onShowNotification('success', `Product "${formData.name}" saved successfully.`);
      }
      onSaveSuccess(savedProduct);
    } catch (err) {
      if (onShowNotification) {
        onShowNotification('error', err.message || 'Failed to save product');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page-content">
      {/* Top Breadcrumb Navigation */}
      <div className="form-page-topbar">
        <button type="button" className="back-link-btn" onClick={onBack}>
          <ArrowLeftIcon size={16} />
          <span>Back</span>
        </button>
        <h1 className="content-page-title inline-title">{product ? 'Edit Product' : 'Add Product'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="content-card form-grid-card">
          <div className="product-form-columns">
            {/* Left Column: Image Upload Area */}
            <div className="image-upload-column">
              <div className="image-upload-box">
                <div className="upload-icon-circle">
                  <UploadCloudIcon size={28} />
                </div>
                <span className="upload-title">Upload Image</span>
                <span className="upload-hint">PNG, JPG up to 2MB</span>
                <input type="file" accept="image/*" className="upload-file-hidden" />
              </div>
            </div>

            {/* Right Column: Form Inputs */}
            <div className="form-fields-column">
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="field-label">
                    Product Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Odoo Software"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">
                    Product Type <span className="req">*</span>
                  </label>
                  <select
                    className="form-input"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="SERVICE">Software</option>
                    <option value="GOODS">Goods</option>
                    <option value="DIGITAL">Digital</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="field-label">
                    Sales Price (₹) <span className="req">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-input"
                    value={formData.salesPrice}
                    onChange={(e) => setFormData({ ...formData, salesPrice: e.target.value })}
                    placeholder="5000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">
                    Cost Price (₹) <span className="req">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-input"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    placeholder="3000"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Notes</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Business management software"
                />
              </div>
            </div>
          </div>

          {/* Product Variants Section matching middle-left reference image */}
          <div className="variants-embedded-section">
            <div className="variants-header-row">
              <h3 className="section-subheading">Product Variants</h3>
              <button
                type="button"
                className="btn-text-action text-primary"
                onClick={() => setShowAddVariant(true)}
              >
                <PlusIcon size={14} />
                <span>Add Variant</span>
              </button>
            </div>

            {/* Variants table */}
            <div className="variants-subtable-box">
              {variants.map((v) => (
                <div key={v.id} className="variant-row-item">
                  <span className="variant-title font-semibold">{v.name}</span>
                  <span className="variant-price font-semibold text-secondary">
                    + ₹{Number(v.additionalPrice).toLocaleString('en-IN')}
                  </span>
                  <div className="variant-actions">
                    <button type="button" className="table-action-icon edit-btn" title="Edit">
                      <EditIcon size={15} />
                    </button>
                    <button
                      type="button"
                      className="table-action-icon delete-btn"
                      onClick={() => handleDeleteVariant(v.id)}
                      title="Delete"
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                </div>
              ))}

              {showAddVariant && (
                <div className="variant-add-inline">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Variant Name (e.g. Enterprise Edition)"
                    value={variantInput.name}
                    onChange={(e) => setVariantInput({ ...variantInput, name: e.target.value })}
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Additional Price (₹)"
                    value={variantInput.additionalPrice}
                    onChange={(e) => setVariantInput({ ...variantInput, additionalPrice: e.target.value })}
                  />
                  <div className="flex gap-8">
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleAddVariant}>
                      Save
                    </button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddVariant(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="form-action-footer">
            <button type="button" className="btn btn-secondary" onClick={onBack}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

