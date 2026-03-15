/**
 * Gregg Construction - Estimates Service
 */

import api from './api';

const estimateService = {
  // Selections
  async getSelections(projectId) {
    const response = await api.get(`/estimates/projects/${projectId}/selections/`);
    return response.data;
  },
  
  async addSelection(selectionData) {
    const response = await api.post(`/estimates/projects/${selectionData.project}/selections/`, selectionData);
    return response.data;
  },
  
  async updateSelection(id, selectionData) {
    const response = await api.patch(`/estimates/selections/${id}/`, selectionData);
    return response.data;
  },
  
  async removeSelection(id) {
    await api.delete(`/estimates/selections/${id}/`);
  },
  
  // Smart Home Selections
  async getSmartHomeSelections(projectId) {
    const response = await api.get(`/estimates/projects/${projectId}/smart-home/`);
    return response.data;
  },
  
  async addSmartHomeSelection(selectionData) {
    const response = await api.post(`/estimates/projects/${selectionData.project}/smart-home/`, selectionData);
    return response.data;
  },
  
  // Summary
  async getProjectSummary(projectId) {
    const response = await api.get(`/estimates/projects/${projectId}/summary/`);
    return response.data;
  },
  
  // Estimates (Contractor only)
  async generateEstimate(projectId, data = {}) {
    const response = await api.post(`/estimates/projects/${projectId}/generate-estimate/`, data);
    return response.data;
  },
  
  async getEstimate(id) {
    const response = await api.get(`/estimates/${id}/`);
    return response.data;
  },
  
  async updateEstimate(id, data) {
    const response = await api.patch(`/estimates/${id}/`, data);
    return response.data;
  },
  
  // Takeoffs (Contractor only)
  async generateTakeoff(projectId, data = {}) {
    const response = await api.post(`/estimates/projects/${projectId}/generate-takeoff/`, data);
    return response.data;
  },
  
  async getTakeoffs(projectId) {
    const response = await api.get(`/estimates/projects/${projectId}/takeoffs/`);
    return response.data;
  },
};

export default estimateService;
