/**
 * Gregg Construction - Contractor Dashboard
 * Full admin view with pricing, estimates, and client management
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardList,
  HiOutlineTrendingUp,
  HiOutlineDocumentText,
  HiArrowRight,
  HiSearch,
  HiFilter,
} from 'react-icons/hi';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';
import projectService from '../services/projects';
import authService from '../services/auth';

const ContractorDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [projectsData, clientsData] = await Promise.all([
          projectService.getProjects(),
          fetch('/api/accounts/clients/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }).then((res) => res.json()),
        ]);
        
        setProjects(projectsData.results || projectsData);
        setClients(clientsData.results || clientsData || []);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.owner?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.owner?.last_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Stats
  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: HiOutlineHome,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Clients',
      value: clients.length,
      icon: HiOutlineUsers,
      color: 'bg-green-500',
    },
    {
      label: 'In Progress',
      value: projects.filter((p) => p.status === 'build').length,
      icon: HiOutlineTrendingUp,
      color: 'bg-amber-500',
    },
    {
      label: 'Pending Review',
      value: projects.filter((p) => p.status === 'review').length,
      icon: HiOutlineClipboardList,
      color: 'bg-purple-500',
    },
  ];
  
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'design', label: 'Design Phase' },
    { value: 'review', label: 'Contractor Review' },
    { value: 'estimate', label: 'Estimate Phase' },
    { value: 'approved', label: 'Approved' },
    { value: 'build', label: 'Build Phase' },
    { value: 'completed', label: 'Completed' },
  ];
  
  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-charcoal-100 text-charcoal-700',
      design: 'bg-blue-100 text-blue-700',
      review: 'bg-amber-100 text-amber-700',
      estimate: 'bg-purple-100 text-purple-700',
      approved: 'bg-green-100 text-green-700',
      build: 'bg-indigo-100 text-indigo-700',
      completed: 'bg-gold-100 text-gold-700',
    };
    return colors[status] || 'bg-charcoal-100 text-charcoal-700';
  };
  
  return (
    <div className="min-h-screen bg-ivory-100">
      <Navbar />
      
      {/* Header */}
      <div className="bg-charcoal-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-gold-500 uppercase tracking-widest text-sm mb-2">
              Contractor Portal
            </p>
            <h1 className="font-display text-display-sm text-ivory-100 mb-4">
              Welcome, {user?.first_name}
            </h1>
            <p className="text-ivory-300">
              Manage projects, review client selections, and generate estimates.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card padding="lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-display text-charcoal-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-charcoal-500">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or clients..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-charcoal-200 focus:border-gold-500 focus:outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <HiFilter className="text-charcoal-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-charcoal-200 focus:border-gold-500 focus:outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Projects Table */}
        <Card padding="none" className="overflow-hidden">
          <div className="px-6 py-4 bg-charcoal-900">
            <h2 className="font-display text-lg text-ivory-100">
              All Projects
            </h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-charcoal-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-charcoal-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-charcoal-900">
                            {project.project_name}
                          </p>
                          <p className="text-sm text-charcoal-500">
                            {project.style ? project.style.charAt(0).toUpperCase() + project.style.slice(1) : 'Custom'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-charcoal-900">
                            {project.owner?.first_name} {project.owner?.last_name}
                          </p>
                          <p className="text-sm text-charcoal-500">
                            {project.owner?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-charcoal-700 capitalize">
                          {project.project_type?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-charcoal-700">
                          {project.city}, {project.state}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getStatusColor(project.status)}`}>
                          {project.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/contractor/projects/${project.id}`}>
                          <Button variant="ghost" size="sm" icon={<HiArrowRight />} iconPosition="right">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-charcoal-500">No projects found</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContractorDashboard;
