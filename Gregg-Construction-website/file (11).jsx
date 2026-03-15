/**
 * Gregg Construction - Client Dashboard
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiPlus,
  HiOutlineHome,
  HiOutlineClipboardList,
  HiOutlineClock,
  HiArrowRight,
} from 'react-icons/hi';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';

const Dashboard = () => {
  const { user } = useAuth();
  const { projects, fetchProjects, loading } = useProjects();
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  const statusColors = {
    draft: 'status-draft',
    design: 'status-design',
    review: 'status-review',
    approved: 'status-approved',
    build: 'status-build',
    completed: 'status-completed',
  };
  
  const stats = [
    {
      icon: HiOutlineHome,
      label: 'Active Projects',
      value: projects.filter((p) => !['completed', 'cancelled'].includes(p.status)).length,
    },
    {
      icon: HiOutlineClipboardList,
      label: 'Total Projects',
      value: projects.length,
    },
    {
      icon: HiOutlineClock,
      label: 'In Progress',
      value: projects.filter((p) => p.status === 'build').length,
    },
  ];
  
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
              Welcome back
            </p>
            <h1 className="font-display text-display-sm text-ivory-100 mb-4">
              {user?.first_name}'s Dashboard
            </h1>
            <p className="text-ivory-300 max-w-2xl">
              Manage your projects, track progress, and bring your vision to life.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card padding="lg" className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gold-500/10 flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-gold-600" />
                </div>
                <div>
                  <p className="text-3xl font-display text-charcoal-900">{stat.value}</p>
                  <p className="text-charcoal-500 text-sm">{stat.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl text-charcoal-900">Your Projects</h2>
          <Link to="/projects/new">
            <Button variant="primary" icon={<HiPlus />}>
              New Project
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <Card padding="xl" className="text-center">
            <div className="w-20 h-20 mx-auto bg-charcoal-100 rounded-full flex items-center justify-center mb-6">
              <HiOutlineHome className="w-10 h-10 text-charcoal-400" />
            </div>
            <h3 className="font-display text-xl text-charcoal-900 mb-2">
              No Projects Yet
            </h3>
            <p className="text-charcoal-500 mb-8 max-w-md mx-auto">
              Start your first project and begin building your dream home or commercial space.
            </p>
            <Link to="/projects/new">
              <Button variant="primary" icon={<HiPlus />}>
                Start Your First Project
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/projects/${project.id}`}>
                  <Card padding="none" hover className="h-full">
                    {/* Project Image */}
                    <div className="h-48 bg-charcoal-200 relative overflow-hidden">
                      {project.images?.[0] ? (
                        <img
                          src={project.images[0].image}
                          alt={project.project_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HiOutlineHome className="w-16 h-16 text-charcoal-300" />
                        </div>
                      )}
                      <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider ${statusColors[project.status]}`}>
                        {project.status}
                      </span>
                    </div>
                    
                    {/* Project Info */}
                    <CardContent className="p-6">
                      <CardHeader>
                        <CardTitle>{project.project_name}</CardTitle>
                        <p className="text-charcoal-500 text-sm mt-1">
                          {project.city}, {project.state}
                        </p>
                      </CardHeader>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-charcoal-100">
                        <span className="text-sm text-charcoal-500">
                          {project.project_type.replace('_', ' ')}
                        </span>
                        <HiArrowRight className="w-5 h-5 text-gold-500" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
