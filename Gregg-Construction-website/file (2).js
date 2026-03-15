/**
 * Gregg Construction - Authentication Service
 */

import api from './api';

const authService = {
  async login(email, password) {
    const response = await api.post('/token/', {
      username: email,
      password,
    });
    
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    return response.data;
  },
  
  async register(userData) {
    const response = await api.post('/accounts/register/', userData);
    return response.data;
  },
  
  async getCurrentUser() {
    const response = await api.get('/accounts/me/');
    return response.data;
  },
  
  async updateProfile(userData) {
    const response = await api.patch('/accounts/profile/', userData);
    return response.data;
  },
  
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};

export default authService;
