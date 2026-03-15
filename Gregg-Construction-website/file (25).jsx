/**
 * Gregg Construction - Application Routes
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectCreate from './pages/ProjectCreate';
import ProjectDetail from './pages/ProjectDetail';
import MaterialSelection from './pages/MaterialSelection';
import SmartHome from './pages/SmartHome';
import ProjectSummary from './pages/ProjectSummary';
import ContractorDashboard from './pages/ContractorDashboard';
import EstimatePage from './pages/EstimatePage';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, requireContractor = false }) => {
  const { isAuthenticated, isContractor, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireContractor && !isContractor) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Public Route (redirects if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isContractor, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to={isContractor ? '/contractor/dashboard' : '/dashboard'} replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      
      {/* Client Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/new"
        element={
          <ProtectedRoute>
            <ProjectCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/materials"
        element={
          <ProtectedRoute>
            <MaterialSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/smart-home"
        element={
          <ProtectedRoute>
            <SmartHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/summary"
        element={
          <ProtectedRoute>
            <ProjectSummary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      
      {/* Contractor Routes */}
      <Route
        path="/contractor/dashboard"
        element={
          <ProtectedRoute requireContractor>
            <ContractorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contractor/projects/:projectId"
        element={
          <ProtectedRoute requireContractor>
            <EstimatePage />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
