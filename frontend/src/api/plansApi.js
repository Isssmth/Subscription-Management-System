import { apiRequest } from './client';

export const plansApi = {
  getPlans: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.productId) params.append('productId', filters.productId);
    if (filters.active !== undefined && filters.active !== '') params.append('active', filters.active);
    if (filters.frequency) params.append('frequency', filters.frequency);
    if (filters.query) params.append('query', filters.query);
    const queryString = params.toString();
    return apiRequest(`/api/plans${queryString ? `?${queryString}` : ''}`);
  },

  getPlanById: (id) => apiRequest(`/api/plans/${id}`),

  createPlan: (data) =>
    apiRequest('/api/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePlan: (id, data) =>
    apiRequest(`/api/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  toggleStatus: (id) =>
    apiRequest(`/api/plans/${id}/status`, {
      method: 'PATCH',
    }),

  deletePlan: (id) =>
    apiRequest(`/api/plans/${id}`, {
      method: 'DELETE',
    }),
};

