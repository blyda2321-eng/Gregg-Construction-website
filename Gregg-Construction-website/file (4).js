/**
 * Gregg Construction - Materials Service
 */

import api from './api';

const materialService = {
  async getCategories() {
    const response = await api.get('/materials/categories/');
    return response.data;
  },
  
  async getBrands() {
    const response = await api.get('/materials/brands/');
    return response.data;
  },
  
  async getMaterials(params = {}) {
    const response = await api.get('/materials/', { params });
    return response.data;
  },
  
  async getMaterial(slug) {
    const response = await api.get(`/materials/${slug}/`);
    return response.data;
  },
  
  async getMaterialsByProject(projectId) {
    const response = await api.get(`/materials/by-project/${projectId}/`);
    return response.data;
  },
  
  async getSmartHomeSystems(params = {}) {
    const response = await api.get('/materials/smart-home/', { params });
    return response.data;
  },
  
  async getVendors() {
    const response = await api.get('/materials/vendors/');
    return response.data;
  },
};

export default materialService;
