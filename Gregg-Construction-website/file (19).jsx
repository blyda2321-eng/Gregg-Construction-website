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
