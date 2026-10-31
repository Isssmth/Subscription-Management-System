import { apiRequest } from './client';

export const productsApi = {
  getProducts: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.query) params.append('query', filters.query);
    if (filters.active !== undefined && filters.active !== '') params.append('active', filters.active);
    if (filters.type) params.append('type', filters.type);
    const queryString = params.toString();
    return apiRequest(`/api/products${queryString ? `?${queryString}` : ''}`);
  },

  getProductById: (id) => apiRequest(`/api/products/${id}`),

  createProduct: (data) =>
    apiRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id, data) =>
    apiRequest(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  toggleStatus: (id) =>
    apiRequest(`/api/products/${id}/status`, {
      method: 'PATCH',
    }),

  deleteProduct: (id) =>
    apiRequest(`/api/products/${id}`, {
      method: 'DELETE',
    }),

  // Variants
  getVariants: (productId) => apiRequest(`/api/products/${productId}/variants`),

  createVariant: (productId, data) =>
    apiRequest(`/api/products/${productId}/variants`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateVariant: (productId, variantId, data) =>
    apiRequest(`/api/products/${productId}/variants/${variantId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteVariant: (productId, variantId) =>
    apiRequest(`/api/products/${productId}/variants/${variantId}`, {
      method: 'DELETE',
    }),

  calculatePrice: (productId, variantIds) =>
    apiRequest(`/api/products/${productId}/variants/calculate-price`, {
      method: 'POST',
      body: JSON.stringify({ variantIds }),
    }),
};

