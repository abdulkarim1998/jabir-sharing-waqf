import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getOrganizationRequests = async (status = 'pending') => {
  const response = await api.get(`/organization-requests?status=${status}`);
  return response.data;
};

export const getOrganizationRequest = async (id) => {
  const response = await api.get(`/organization-requests/${id}`);
  return response.data;
};

export const createOrganizationRequest = async (formData) => {
  try {
    const response = await api.post('/organization-requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Check if the response indicates success
    if (response.data && !response.data.success) {
      throw new Error(response.data.error || 'Failed to create organization request');
    }
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateRequestStatus = async (id, status) => {
  const response = await api.put(`/organization-requests/${id}/status`, { status });
  return response.data;
};

export default api;

