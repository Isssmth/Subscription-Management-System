import { apiRequest } from './client';

export const taxesApi = {
  getTaxes: (activeOnly = false) => {
    return apiRequest(`/api/taxes${activeOnly ? '?activeOnly=true' : ''}`);
  },

  getTaxById: (id) => apiRequest(`/api/taxes/${id}`),

  createTax: (data) =>
    apiRequest('/api/taxes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTax: (id, data) =>
    apiRequest(`/api/taxes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  toggleStatus: (id) =>
    apiRequest(`/api/taxes/${id}/status`, {
      method: 'PATCH',
    }),

  deleteTax: (id) =>
    apiRequest(`/api/taxes/${id}`, {
      method: 'DELETE',
    }),
};

