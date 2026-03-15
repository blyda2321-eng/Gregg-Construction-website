/**
 * Gregg Construction - Material Card Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HiCheck, HiPlus, HiEye } from 'react-icons/hi';
import Card from '../common/Card';

const MaterialCard = ({
  material,
  isSelected,
  onViewDetails,
  onQuickAdd,
}) => {
  const tierColors = {
    standard: 'bg-charcoal-100 text-charcoal-700',
    premium: 'bg-gold-100 text-gold-700',
    luxury: 'bg-charcoal-900 text-gold-400',
  };
  
  return (
    <Card padding="none" hover className="h-full flex flex-col group">
      {/* Image */}
      <div className="relative aspect-square bg-charcoal-100 overflow-hidden">
        {material.image ? (
          <img
            src={material.image}
            alt={material.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-charcoal-300 text-4xl font-display">
              {material.brand?.name?.charAt(0) || 'M'}
            </span>
          </div>
        )}
        
        {/* Tier Badge */}
        <span
          className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold uppercase tracking-wider ${
            tierColors[material.tier]
          }`}
        >
          {material.tier}
        </span>
        
        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-8 h-8 bg-gold-500 flex items-center justify-center">
            <HiCheck className="w-5 h-5 text-charcoal-900" />
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-charcoal-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="w-12 h-12 bg-white flex items-center justify-center hover:bg-gold-500 transition-colors"
          >
            <HiEye className="w-5 h-5 text-charcoal-900" />
          </button>
          {!isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd();
              }}
              className="w-12 h-12 bg-gold-500 flex items-center justify-center hover:bg-gold-400 transition-colors"
            >
              <HiPlus className="w-5 h-5 text-charcoal-900" />
            </button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Brand */}
        {material.brand && (
          <span className="text-xs text-gold-600 font-semibold uppercase tracking-wider">
            {material.brand.name}
          </span>
        )}
        
        {/* Name */}
        <h3 className="font-display text-lg text-charcoal-900 mt-1 line-clamp-2">
          {material.name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-charcoal-500 mt-2 line-clamp-2 flex-1">
          {material.client_description}
        </p>
        
        {/* Action */}
        <button
          onClick={onViewDetails}
          className="mt-4 text-sm text-gold-600 font-semibold uppercase tracking-wider hover:text-gold-700 transition-colors"
        >
          View Details →
        </button>
      </div>
    </Card>
  );
};

export default MaterialCard;
