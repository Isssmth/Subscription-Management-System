import React, { useState, useEffect } from 'react';
import { productsApi } from '../api/productsApi';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ConfirmModal } from '../components/ConfirmModal';
import { ProductModal } from './ProductModal';

export function ProductsPage({ onSelectProduct, onShowNotification }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    query: '',
    active: '',
    type: '',
  });

  // Modals
  const [modalState, setModalState] = useState({ isOpen: false, product: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getProducts(filters);
      setProducts(data || []);
    } catch (err) {
      onShowNotification('error', err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const handleSaveProduct = async (productData) => {
    if (modalState.product) {
      await productsApi.updateProduct(modalState.product.id, productData);
      onShowNotification('success', `Product "${productData.name}" updated successfully.`);
    } else {
      await productsApi.createProduct(productData);
      onShowNotification('success', `Product "${productData.name}" created successfully.`);
    }
    await loadProducts();
  };

  const handleToggleStatus = async (product) => {
    try {
      const updated = await productsApi.toggleStatus(product.id);
      onShowNotification(
        'success',
        `Product "${product.name}" marked as ${updated.active ? 'active' : 'inactive'}.`
      );
      await loadProducts();
    } catch (err) {
      onShowNotification('error', err.message || 'Failed to update status');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteModal.product) return;
    try {
      await productsApi.deleteProduct(deleteModal.product.id);
      onShowNotification('success', `Product "${deleteModal.product.name}" deleted successfully.`);
      setDeleteModal({ isOpen: false, product: null });
      await loadProducts();
    } catch (err) {
      onShowNotification('error', err.message || 'Failed to delete product');
    }
  };

  return (
    <div className="module-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>Products Management</h2>
          <p className="page-subtext">Manage core goods, services, sales & cost prices, and item variants.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setModalState({ isOpen: true, product: null })}
        >
          + Add Product
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group search-group">
          <input
            type="text"
            className="filter-input"
            placeholder="Search products by name or notes..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="SERVICE">Service</option>
            <option value="GOODS">Goods</option>
            <option value="DIGITAL">Digital</option>
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

        {(filters.query || filters.type || filters.active !== '') && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setFilters({ query: '', active: '', type: '' })}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Main Content */}
      {loading ? (
        <LoadingSpinner message="Fetching products list..." />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description={
            filters.query || filters.type || filters.active !== ''
              ? 'No products matched your active search or filter criteria.'
              : 'Start by creating your first product in the catalog.'
          }
          actionText="+ Create Product"
          onAction={() => setModalState({ isOpen: true, product: null })}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Sales Price</th>
                <th>Cost Price</th>
                <th>Variants</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="product-cell">
                      <span
                        className="product-name-link"
                        onClick={() => onSelectProduct(p.id)}
                        title="Click to view details and variants"
                      >
                        {p.name}
                      </span>
                      {p.notes && <span className="product-notes-preview">{p.notes}</span>}
                    </div>
                  </td>
                  <td>
                    <Badge type={p.type} />
                  </td>
                  <td className="font-mono font-semibold">
                    ₹{Number(p.salesPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="font-mono text-muted">
                    ₹{Number(p.costPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span
                      className="variant-count-pill"
                      onClick={() => onSelectProduct(p.id)}
                      title="Manage variants"
                    >
                      {p.variantCount} variant(s)
                    </span>
                  </td>
                  <td>
                    <span
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(p)}
                      title="Click to toggle status"
                    >
                      <Badge type={p.active} />
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="action-buttons-group">
                      <button
                        type="button"
                        className="action-btn text-primary"
                        onClick={() => onSelectProduct(p.id)}
                        title="View details & variants"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="action-btn text-primary"
                        onClick={() => setModalState({ isOpen: true, product: p })}
                        title="Edit product"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="action-btn text-danger"
                        onClick={() => setDeleteModal({ isOpen: true, product: p })}
                        title="Delete product"
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

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={modalState.isOpen}
        product={modalState.product}
        onClose={() => setModalState({ isOpen: false, product: null })}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.product?.name}"? All associated variants and pricing rules will also be deleted.`}
        confirmText="Delete Product"
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteModal({ isOpen: false, product: null })}
      />
    </div>
  );
}

