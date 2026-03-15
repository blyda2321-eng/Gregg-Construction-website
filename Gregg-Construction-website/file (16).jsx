/**
 * Gregg Construction - Material Detail Modal
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiX,
  HiCheck,
  HiPlus,
  HiMinus,
  HiShieldCheck,
  HiTruck,
  HiInformationCircle,
} from 'react-icons/hi';
import Button from '../common/Button';

const MaterialDetail = ({
  material,
  isOpen,
  onClose,
  onAddToProject,
  isAdding,
  isSelected,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [locationNotes, setLocationNotes] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  if (!material) return null;
  
  const images = material.images?.length > 0
    ? material.images
    : [{ image: material.image, caption: material.name }];
  
  const handleAdd = () => {
    onAddToProject(material, quantity, locationNotes);
    setQuantity(1);
    setLocationNotes('');
  };
  
  const tierLabels = {
    standard: 'Standard Quality',
    premium: 'Premium Quality',
    luxury: 'Luxury Collection',
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal-950/90 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-hidden bg-white shadow-luxury-xl flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-charcoal-900 text-ivory-100 flex items-center justify-center hover:bg-charcoal-700 transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
            
            <div className="flex-1 overflow-auto">
              <div className="flex flex-col lg:flex-row min-h-full">
                {/* Image Gallery */}
                <div className="lg:w-1/2 bg-charcoal-100 p-6 lg:p-10">
                  <div className="sticky top-0">
                    {/* Main Image */}
                    <div className="aspect-square bg-white mb-4 overflow-hidden">
                      <img
                        src={images[activeImageIndex]?.image || '/assets/images/placeholder.jpg'}
                        alt={material.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    {/* Thumbnails */}
                    {images.length > 1 && (
                      <div className="flex space-x-2 overflow-x-auto">
                        {images.map((img, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 overflow-hidden border-2 ${
                              index === activeImageIndex
                                ? 'border-gold-500'
                                : 'border-transparent'
                            }`}
                          >
                            <img
                              src={img.image}
                              alt={img.caption}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Details */}
                <div className="lg:w-1/2 p-6 lg:p-10">
                  {/* Badge */}
                  <div className="flex items-center space-x-3 mb-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                        material.tier === 'luxury'
                          ? 'bg-charcoal-900 text-gold-400'
                          : material.tier === 'premium'
                          ? 'bg-gold-100 text-gold-700'
                          : 'bg-charcoal-100 text-charcoal-700'
                      }`}
                    >
                      {tierLabels[material.tier]}
                    </span>
                    {material.in_stock ? (
                      <span className="text-green-600 text-sm flex items-center">
                        <HiCheck className="w-4 h-4 mr-1" /> In Stock
                      </span>
                    ) : (
                      <span className="text-amber-600 text-sm">
                        {material.lead_time_days} days lead time
                      </span>
                    )}
                  </div>
                  
                  {/* Brand */}
                  {material.brand && (
                    <p className="text-gold-600 font-semibold uppercase tracking-wider text-sm">
                      {material.brand.name}
                    </p>
                  )}
                  
                  {/* Name */}
                  <h2 className="font-display text-3xl text-charcoal-900 mt-2">
                    {material.name}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-charcoal-600 mt-4 leading-relaxed">
                    {material.client_description}
                  </p>
                  
                  {/* Features */}
                  {material.features && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-charcoal-900 mb-3">
                        Features
                      </h3>
                      <ul className="space-y-2">
                        {material.features.split('\n').map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <HiCheck className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                            <span className="text-charcoal-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Specifications */}
                  {material.specifications && Object.keys(material.specifications).length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-charcoal-900 mb-3">
                        Specifications
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(material.specifications).map(([key, value]) => (
                          <div key={key} className="bg-charcoal-50 p-3">
                            <p className="text-xs text-charcoal-500 uppercase tracking-wider">
                              {key}
                            </p>
                            <p className="text-charcoal-900 font-medium mt-1">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Warranty */}
                  {material.warranty_info && (
                    <div className="mt-6 p-4 bg-gold-50 border-l-4 border-gold-500">
                      <div className="flex items-start space-x-3">
                        <HiShieldCheck className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-charcoal-900">Warranty</p>
                          <p className="text-sm text-charcoal-600 mt-1">
                            {material.warranty_info}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Add to Project Form */}
                  {!isSelected && (
                    <div className="mt-8 pt-6 border-t border-charcoal-200">
                      <h3 className="font-semibold text-charcoal-900 mb-4">
                        Add to Your Project
                      </h3>
                      
                      {/* Quantity */}
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-sm text-charcoal-600">Quantity:</span>
                        <div className="flex items-center border border-charcoal-200">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center hover:bg-charcoal-50"
                          >
                            <HiMinus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 h-10 text-center border-x border-charcoal-200 focus:outline-none"
                          />
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-charcoal-50"
                          >
                            <HiPlus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-sm text-charcoal-500">
                          {material.unit_type}
                        </span>
                      </div>
                      
                      {/* Location Notes */}
                      <div className="mb-4">
                        <label className="block text-sm text-charcoal-600 mb-2">
                          Location / Notes (optional)
                        </label>
                        <input
                          type="text"
                          value={locationNotes}
                          onChange={(e) => setLocationNotes(e.target.value)}
                          placeholder="e.g., Master Bathroom, Kitchen Island"
                          className="w-full px-4 py-3 border border-charcoal-200 focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                      
                      <Button
                        onClick={handleAdd}
                        loading={isAdding}
                        variant="primary"
                        size="lg"
                        className="w-full"
                        icon={<HiPlus />}
                      >
                        Add to Project
                      </Button>
                    </div>
                  )}
                  
                  {/* Already Selected */}
                  {isSelected && (
                    <div className="mt-8 p-4 bg-green-50 border border-green-200">
                      <div className="flex items-center space-x-3">
                        <HiCheck className="w-6 h-6 text-green-600" />
                        <span className="font-semibold text-green-800">
                          This item is already in your project
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MaterialDetail;
