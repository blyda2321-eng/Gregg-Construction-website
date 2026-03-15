/**
 * Gregg Construction - Material Selection Page
 * Main interface for clients to select materials for their project
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineLightningBolt,
  HiOutlineSparkles,
  HiOutlineColorSwatch,
  HiSearch,
  HiFilter,
  HiCheck,
  HiPlus,
  HiChevronRight,
  HiShoppingCart,
} from 'react-icons/hi';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import CategoryNav from '../components/materials/CategoryNav';
import MaterialCard from '../components/materials/MaterialCard';
import MaterialDetail from '../components/materials/MaterialDetail';
import { useProjects } from '../hooks/useProjects';
import materialService from '../services/materials';
import estimateService from '../services/estimates';

const MaterialSelection = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, fetchProject, selections, fetchSelections, addSelection } = useProjects();
  
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  
  // Category icons mapping
  const categoryIcons = {
    exterior: HiOutlineHome,
    interior: HiOutlineCube,
    mechanical: HiOutlineLightningBolt,
    premium: HiOutlineSparkles,
    landscaping: HiOutlineColorSwatch,
  };
  
  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchProject(projectId);
        await fetchSelections(projectId);
        
        const categoriesData = await materialService.getCategories();
        setCategories(categoriesData);
        
        if (categoriesData.length > 0) {
          setActiveCategory(categoriesData[0]);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [projectId, fetchProject, fetchSelections]);
  
  // Fetch materials when category changes
  useEffect(() => {
    const loadMaterials = async () => {
      if (!activeCategory) return;
      
      setLoading(true);
      try {
        const data = await materialService.getMaterials({
          category: activeCategory.id,
          project_id: projectId,
        });
        setMaterials(data.results || data);
        setFilteredMaterials(data.results || data);
      } catch (err) {
        console.error('Failed to load materials:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadMaterials();
  }, [activeCategory, projectId]);
  
  // Filter materials based on search and tier
  useEffect(() => {
    let filtered = [...materials];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.brand?.name.toLowerCase().includes(query) ||
          m.client_description?.toLowerCase().includes(query)
      );
    }
    
    if (tierFilter !== 'all') {
      filtered = filtered.filter((m) => m.tier === tierFilter);
    }
    
    setFilteredMaterials(filtered);
  }, [searchQuery, tierFilter, materials]);
  
  // Handle material selection
  const handleAddToProject = async (material, quantity = 1, locationNotes = '') => {
    setIsAddingMaterial(true);
    try {
      await addSelection({
        project: parseInt(projectId),
        material: material.id,
        quantity,
        location_notes: locationNotes,
      });
      setIsDetailModalOpen(false);
    } catch (err) {
      console.error('Failed to add material:', err);
    } finally {
      setIsAddingMaterial(false);
    }
  };
  
  // Check if material is already selected
  const isMaterialSelected = (materialId) => {
    return selections.some((s) => s.material.id === materialId);
  };
  
  // Get selection count for display
  const getSelectionCount = () => selections.length;
  
  if (loading && !currentProject) {
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
      <div className="bg-charcoal-900 pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-gold-500 uppercase tracking-widest text-sm mb-2">
                {currentProject?.project_name}
              </p>
              <h1 className="font-display text-display-sm text-ivory-100">
                Select Materials
              </h1>
              <p className="text-ivory-300 mt-2">
                Choose from our curated selection of premium materials
              </p>
            </motion.div>
            
            {/* Selection Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 lg:mt-0"
            >
              <Button
                variant="primary"
                onClick={() => navigate(`/projects/${projectId}/summary`)}
                icon={<HiShoppingCart />}
              >
                View Selections ({getSelectionCount()})
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Category Navigation */}
      <div className="sticky top-20 z-30 bg-ivory-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <CategoryNav
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            categoryIcons={categoryIcons}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Subcategories */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card padding="none" className="sticky top-44 overflow-hidden">
              <div className="p-4 bg-charcoal-900">
                <h3 className="font-semibold text-ivory-100">
                  {activeCategory?.name}
                </h3>
              </div>
              <div className="p-2">
                {activeCategory?.subcategories?.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveCategory(sub)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gold-50 transition-colors flex items-center justify-between group"
                  >
                    <span className="text-charcoal-700 group-hover:text-charcoal-900">
                      {sub.name}
                    </span>
                    <HiChevronRight className="w-4 h-4 text-charcoal-400 group-hover:text-gold-500" />
                  </button>
                ))}
              </div>
            </Card>
            
            {/* Climate Zone Info */}
            {currentProject?.climate_zone && (
              <Card padding="md" className="mt-4 bg-gold-50 border-l-4 border-gold-500">
                <p className="text-sm font-medium text-charcoal-900">
                  Climate Zone
                </p>
                <p className="text-sm text-charcoal-600 mt-1">
                  {currentProject.climate_zone.name}
                </p>
                <p className="text-xs text-charcoal-500 mt-2">
                  Materials are filtered for your region
                </p>
              </Card>
            )}
          </aside>
          
          {/* Materials Grid */}
          <main className="flex-1">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search materials, brands..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-charcoal-200 focus:border-gold-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <HiFilter className="text-charcoal-400" />
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="px-4 py-3 bg-white border border-charcoal-200 focus:border-gold-500 focus:outline-none"
                >
                  <option value="all">All Tiers</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
            
            {/* Materials Count */}
            <p className="text-sm text-charcoal-500 mb-4">
              Showing {filteredMaterials.length} materials
            </p>
            
            {/* Materials Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredMaterials.length === 0 ? (
              <Card padding="xl" className="text-center">
                <p className="text-charcoal-500">
                  No materials found matching your criteria.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map((material, index) => (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <MaterialCard
                      material={material}
                      isSelected={isMaterialSelected(material.id)}
                      onViewDetails={() => {
                        setSelectedMaterial(material);
                        setIsDetailModalOpen(true);
                      }}
                      onQuickAdd={() => handleAddToProject(material)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Material Detail Modal */}
      <MaterialDetail
        material={selectedMaterial}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedMaterial(null);
        }}
        onAddToProject={handleAddToProject}
        isAdding={isAddingMaterial}
        isSelected={selectedMaterial ? isMaterialSelected(selectedMaterial.id) : false}
      />
      
      <Footer />
    </div>
  );
};

export default MaterialSelection;
