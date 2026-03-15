/**
 * Gregg Construction - Project Summary Page
 * Shows all selections and project overview for clients
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineLightningBolt,
  HiOutlineSparkles,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineDocumentText,
  HiArrowRight,
  HiCheck,
} from 'react-icons/hi';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import estimateService from '../services/estimates';

const ProjectSummary = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isContractor } = useAuth();
  const { currentProject, fetchProject, selections, fetchSelections, removeSelection } = useProjects();
  
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchProject(projectId);
        await fetchSelections(projectId);
        
        const summaryData = await estimateService.getProjectSummary(projectId);
        setSummary(summaryData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [projectId, fetchProject, fetchSelections]);
  
  const handleDeleteSelection = async () => {
    if (!itemToDelete) return;
    
    try {
      await removeSelection(itemToDelete.id);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      
      // Refresh summary
      const summaryData = await estimateService.getProjectSummary(projectId);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to delete selection:', err);
    }
  };
  
  const confirmDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };
  
  // Group selections by category
  const groupedSelections = selections.reduce((acc, selection) => {
    const category = selection.material?.category?.category_type || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(selection);
    return acc;
  }, {});
  
  const categoryLabels = {
    exterior: { label: 'Exterior', icon: HiOutlineHome },
    interior: { label: 'Interior', icon: HiOutlineCube },
    mechanical: { label: 'Mechanical', icon: HiOutlineLightningBolt },
    premium: { label: 'Smart Home & Premium', icon: HiOutlineSparkles },
    other: { label: 'Other', icon: HiOutlineCube },
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-ivory-100">
      <Navbar />
      
      {/* Header */}
      <div className="bg-charcoal-900 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-gold-500 uppercase tracking-widest text-sm mb-2">
              Project Summary
            </p>
            <h1 className="font-display text-display-sm text-ivory-100">
              {currentProject?.project_name}
            </h1>
            <p className="text-ivory-300 mt-2">
              {currentProject?.city}, {currentProject?.state} • {summary?.project_type}
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selections List */}
          <div className="lg:col-span-2 space-y-8">
            {Object.entries(groupedSelections).map(([categoryType, items]) => {
              const categoryInfo = categoryLabels[categoryType];
              const Icon = categoryInfo?.icon || HiOutlineCube;
              
              return (
                <motion.div
                  key={categoryType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-charcoal-900 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gold-500" />
                    </div>
                    <h2 className="font-display text-xl text-charcoal-900">
                      {categoryInfo?.label || categoryType}
                    </h2>
                    <span className="text-charcoal-500 text-sm">
                      ({items.length} items)
                    </span>
                  </div>
                  
                  <Card padding="none" className="overflow-hidden">
                    <div className="divide-y divide-charcoal-100">
                      {items.map((selection) => (
                        <div
                          key={selection.id}
                          className="p-4 flex items-center space-x-4 hover:bg-charcoal-50 transition-colors"
                        >
                          {/* Image */}
                          <div className="w-20 h-20 bg-charcoal-100 flex-shrink-0 overflow-hidden">
                            {selection.material?.image ? (
                              <img
                                src={selection.material.image}
                                alt={selection.material.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Icon className="w-8 h-8 text-charcoal-300" />
                              </div>
                            )}
                          </div>
                          
                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            {selection.material?.brand && (
                              <p className="text-xs text-gold-600 font-semibold uppercase tracking-wider">
                                {selection.material.brand.name}
                              </p>
                            )}
                            <h3 className="font-semibold text-charcoal-900 truncate">
                              {selection.material?.name}
                            </h3>
                            <p className="text-sm text-charcoal-500">
                              Qty: {selection.quantity} {selection.material?.unit_type}
                              {selection.location_notes && ` • ${selection.location_notes}`}
                            </p>
                          </div>
                          
                          {/* Tier Badge */}
                          <span
                            className={`px-2 py-1 text-xs font-semibold uppercase tracking-wider ${
                              selection.material?.tier === 'luxury'
                                ? 'bg-charcoal-900 text-gold-400'
                                : selection.material?.tier === 'premium'
                                ? 'bg-gold-100 text-gold-700'
                                : 'bg-charcoal-100 text-charcoal-700'
                            }`}
                          >
                            {selection.material?.tier}
                          </span>
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => confirmDelete(selection)}
                              className="p-2 text-charcoal-400 hover:text-red-500 transition-colors"
                            >
                              <HiOutlineTrash className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
            
            {/* Smart Home Selections */}
            {summary?.smart_home_selections?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-charcoal-900 flex items-center justify-center">
                    <HiOutlineSparkles className="w-5 h-5 text-gold-500" />
                  </div>
                  <h2 className="font-display text-xl text-charcoal-900">
                    Smart Home Systems
                  </h2>
                </div>
                
                <Card padding="none" className="overflow-hidden">
                  <div className="divide-y divide-charcoal-100">
                    {summary.smart_home_selections.map((selection) => (
                      <div
                        key={selection.id}
                        className="p-4 flex items-center space-x-4"
                      >
                        <div className="w-20 h-20 bg-charcoal-900 flex-shrink-0 flex items-center justify-center">
                          <HiOutlineSparkles className="w-8 h-8 text-gold-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gold-600 font-semibold uppercase tracking-wider">
                            {selection.system?.brand?.name}
                          </p>
                          <h3 className="font-semibold text-charcoal-900">
                            {selection.system?.name}
                          </h3>
                          <p className="text-sm text-charcoal-500">
                            {selection.system?.system_type?.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
            
            {/* Empty State */}
            {selections.length === 0 && (
              <Card padding="xl" className="text-center">
                <HiOutlineCube className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
                <h3 className="font-display text-xl text-charcoal-900 mb-2">
                  No Selections Yet
                </h3>
                <p className="text-charcoal-500 mb-6">
                  Start adding materials to your project
                </p>
                <Link to={`/projects/${projectId}/materials`}>
                  <Button variant="primary" icon={<HiArrowRight />} iconPosition="right">
                    Browse Materials
                  </Button>
                </Link>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <Card padding="lg" className="sticky top-28">
              <h3 className="font-display text-lg text-charcoal-900 mb-4">
                Project Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-charcoal-500">Style</p>
                  <p className="font-medium text-charcoal-900 capitalize">
                    {summary?.style || currentProject?.style}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-charcoal-500">Location</p>
                  <p className="font-medium text-charcoal-900">
                    {summary?.location}
                  </p>
                </div>
                
                {currentProject?.square_footage && (
                  <div>
                    <p className="text-sm text-charcoal-500">Size</p>
                    <p className="font-medium text-charcoal-900">
                      {currentProject.square_footage.toLocaleString()} sq ft
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-charcoal-500">Status</p>
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium">
                    {summary?.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-charcoal-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-charcoal-600">Total Selections</span>
                  <span className="font-semibold text-charcoal-900">
                    {selections.length + (summary?.smart_home_selections?.length || 0)}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Link to={`/projects/${projectId}/materials`} className="block">
                  <Button variant="secondary" className="w-full">
                    Add More Materials
                  </Button>
                </Link>
                
                <Link to={`/projects/${projectId}/smart-home`} className="block">
                  <Button variant="secondary" className="w-full">
                    Smart Home Options
                  </Button>
                </Link>
                
                <Button
                  variant="primary"
                  className="w-full"
                  icon={<HiCheck />}
                >
                  Submit for Review
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Remove Selection"
        size="sm"
      >
        <p className="text-charcoal-600 mb-6">
          Are you sure you want to remove{' '}
          <span className="font-semibold">{itemToDelete?.material?.name}</span>{' '}
          from your project?
        </p>
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            onClick={() => setIsDeleteModalOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteSelection}
            className="flex-1"
          >
            Remove
          </Button>
        </div>
      </Modal>
      
      <Footer />
    </div>
  );
};

export default ProjectSummary;
