/**
 * Gregg Construction - Smart Home System Card
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  HiCheck,
  HiPlus,
  HiOutlineLightBulb,
  HiOutlineChip,
} from 'react-icons/hi';
import Card from '../common/Card';
import Button from '../common/Button';

const SmartHomeCard = ({ system, isSelected, onAdd }) => {
  const systemTypeLabels = {
    whole_home: 'Complete Control System',
    lighting: 'Lighting Control',
    climate: 'Climate Control',
    security: 'Security System',
    audio: 'Audio/Video',
    shades: 'Motorized Shades',
    fireplace: 'Fireplace Control',
    garage: 'Garage/Access',
    outdoor: 'Outdoor Living',
  };
  
  return (
    <Card padding="none" hover className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="relative">
        <div className="aspect-video bg-charcoal-900 overflow-hidden">
          {system.image ? (
            <img
              src={system.image}
              alt={system.name}
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <HiOutlineChip className="w-16 h-16 text-charcoal-700" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 to-transparent" />
          
          {/* Badge */}
          <span className="absolute top-4 left-4 px-3 py-1 bg-gold-500 text-charcoal-900 text-xs font-semibold uppercase tracking-wider">
            {systemTypeLabels[system.system_type]}
          </span>
          
          {/* Selected Indicator */}
          {isSelected && (
            <div className="absolute top-4 right-4 w-10 h-10 bg-green-500 flex items-center justify-center">
              <HiCheck className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        
        {/* Brand Logo Overlay */}
        {system.brand && (
          <div className="absolute bottom-4 left-4">
            <span className="text-ivory-100 font-semibold">
              {system.brand.name}
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display text-xl text-charcoal-900">
          {system.name}
        </h3>
        
        <p className="text-charcoal-600 text-sm mt-2 line-clamp-3 flex-1">
          {system.client_description}
        </p>
        
        {/* Features */}
        {system.features && (
          <div className="mt-4 pt-4 border-t border-charcoal-100">
            <ul className="space-y-2">
              {system.features.split('\n').slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm">
                  <HiOutlineLightBulb className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <span className="text-charcoal-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Action */}
        <div className="mt-6">
          {isSelected ? (
            <div className="flex items-center justify-center space-x-2 py-3 bg-green-50 text-green-700">
              <HiCheck className="w-5 h-5" />
              <span className="font-semibold">Added to Project</span>
            </div>
          ) : (
            <Button
              onClick={onAdd}
              variant="dark"
              className="w-full"
              icon={<HiPlus />}
            >
              Add to Project
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SmartHomeCard;
