/**
 * Gregg Construction - Smart Home Selection Page
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineLightBulb,
  HiOutlineVolumeUp,
  HiOutlineVideoCamera,
  HiOutlineLockClosed,
  HiOutlineAdjustments,
  HiOutlineSun,
  HiOutlineFire,
  HiArrowRight,
  HiCheck,
  HiShoppingCart,
} from 'react-icons/hi';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import SmartHomeCard from '../components/materials/SmartHomeCard';
import { useProjects } from '../hooks/useProjects';
import materialService from '../services/materials';
import estimateService from '../services/estimates';

const SmartHome = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, fetchProject } = useProjects();
  
  const [systems, setSystems] = useState([]);
  const [selectedSystems, setSelectedSystems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // System type filters
  const systemFilters = [
    { value: 'all', label: 'All Systems', icon: HiOutlineAdjustments },
    { value: 'whole_home', label: 'Whole Home', icon: HiOutlineAdjustments },
    { value: 'lighting', label: 'Lighting', icon: HiOutlineLightBulb },
    { value: 'audio', label: 'Audio/Video', icon: HiOutlineVolumeUp },
    { value: 'security', label: 'Security', icon: HiOutlineVideoCamera },
    { value: 'climate', label: 'Climate', icon: HiOutlineSun },
    { value: 'shades', label: 'Shades', icon: HiOutlineSun },
    { value: 'fireplace', label: 'Fireplace', icon: HiOutlineFire },
  ];
  
  // Featured brands
  const featuredBrands = [
    { name: 'Crestron', logo: '/assets/images/brands/crestron.png' },
    { name: 'Control4', logo: '/assets/images/brands/control4.png' },
    { name: 'Savant', logo: '/assets/images/brands/savant.png' },
    { name: 'Lutron', logo: '/assets/images/brands/lutron.png' },
    { name: 'Sonos', logo: '/assets/images/brands/sonos.png' },
  ];
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchProject(projectId);
        
        const params = activeFilter !== 'all' ? { system_type: activeFilter } : {};
        const data = await materialService.getSmartHomeSystems(params);
        setSystems(data.results || data);
        
        // Load existing selections
        const selections = await estimateService.getSmartHomeSelections(projectId);
        setSelectedSystems(selections.results || selections);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [projectId, fetchProject, activeFilter]);
  
  const handleAddSystem = async (system) => {
    try {
      await estimateService.addSmartHomeSelection({
        project: parseInt(projectId),
        system: system.id,
        quantity: 1,
      });
      
      setSelectedSystems([...selectedSystems, { system }]);
    } catch (err) {
      console.error('Failed to add system:', err);
    }
  };
  
  const isSystemSelected = (systemId) => {
    return selectedSystems.some((s) => s.system?.id === systemId);
  };
  
  return (
    <div className="min-h-screen bg-ivory-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-charcoal-900 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-gold-500/10 px-4 py-2 mb-6">
              <HiOutlineLightBulb className="w-5 h-5 text-gold-500" />
              <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold">
                Smart Home Integration
              </span>
            </div>
            
            <h1 className="font-display text-display-md text-ivory-100 mb-4">
              Intelligent Living,
              <span className="text-gold-500"> Effortless Control</span>
            </h1>
            
            <p className="text-ivory-300 text-xl max-w-3xl mx-auto">
              Transform your home with cutting-edge automation systems. Control lighting, climate, entertainment, and security from a single touch panel or your smartphone.
            </p>
          </motion.div>
          
          {/* Featured Brands */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8"
          >
            {featuredBrands.map((brand) => (
              <div
                key={brand.name}
                className="bg-white/10 px-6 py-3 backdrop-blur-sm"
              >
                <span className="text-ivory-200 font-semibold">{brand.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="sticky top-20 z-30 bg-ivory-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
            {systemFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`flex items-center space-x-2 px-4 py-2 whitespace-nowrap transition-all duration-300 ${
                  activeFilter === filter.value
                    ? 'bg-charcoal-900 text-ivory-100'
                    : 'bg-white text-charcoal-700 hover:bg-charcoal-50'
                }`}
              >
                <filter.icon className={`w-4 h-4 ${activeFilter === filter.value ? 'text-gold-500' : ''}`} />
                <span className="text-sm font-medium">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* Selection Summary */}
        {selectedSystems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-gold-50 border-l-4 border-gold-500 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <HiCheck className="w-5 h-5 text-gold-600" />
              <span className="font-medium text-charcoal-900">
                {selectedSystems.length} smart home system{selectedSystems.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/projects/${projectId}/summary`)}
              icon={<HiShoppingCart />}
            >
              View All Selections
            </Button>
          </motion.div>
        )}
        
        {/* Systems Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {systems.map((system, index) => (
              <motion.div
                key={system.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SmartHomeCard
                  system={system}
                  isSelected={isSystemSelected(system.id)}
                  onAdd={() => handleAddSystem(system)}
                />
              </motion.div>
            ))}
          </div>
        )}
        
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <Card variant="dark" padding="xl" className="text-center">
            <h2 className="font-display text-2xl text-ivory-100 mb-4">
              Need Help Designing Your Smart Home?
            </h2>
            <p className="text-ivory-300 max-w-2xl mx-auto mb-8">
              Our expert team can help you design a fully integrated smart home system tailored to your lifestyle and budget.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/projects/${projectId}/summary`)}
              icon={<HiArrowRight />}
              iconPosition="right"
            >
              Continue to Project Summary
            </Button>
          </Card>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SmartHome;
