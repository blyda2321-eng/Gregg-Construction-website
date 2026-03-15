/**
 * Gregg Construction - Projects Service
 */

import api from './api';

const projectService = {
  async getProjects(params = {}) {
    const response = await api.get('/projects/', { params });
    return response.data;
  },
  
  async getProject(id) {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  },
  
  async createProject(projectData) {
    const response = await api.post('/projects/', projectData);
    return response.data;
  },
  
  async updateProject(id, projectData) {
    const response = await api.patch(`/projects/${id}/`, projectData);
    return response.data;
  },
  
  async deleteProject(id) {
    await api.delete(`/projects/${id}/`);
  },
  
  async updateStatus(id, status) {
    const response = await api.patch(`/projects/${id}/status/`, { status });
    return response.data;
  },
  
  async uploadImage(projectId, formData) {
    const response = await api.post(`/projects/${projectId}/images/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  async lookupZipCode(zipCode) {
    const response = await api.get(`/projects/zip-lookup/${zipCode}/`);
    return response.data;
  },
  
  async getClimateZones() {
    const response = await api.get('/projects/climate-zones/');
    return response.data;
  },
};

export default projectService;
