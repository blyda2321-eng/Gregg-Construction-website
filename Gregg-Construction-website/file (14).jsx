/**
 * Gregg Construction - Category Navigation Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCube } from 'react-icons/hi';

const CategoryNav = ({
  categories,
  activeCategory,
  onCategoryChange,
  categoryIcons,
}) => {
  return (
    <div className="py-4 overflow-x-auto scrollbar-hide">
      <div className="flex space-x-2 min-w-max">
        {categories.map((category) => {
          const Icon = categoryIcons[category.category_type] || HiOutlineCube;
          const isActive = activeCategory?.id === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category)}
              className={`relative flex items-center space-x-2 px-5 py-3 transition-all duration-300 ${
                isActive
                  ? 'bg-charcoal-900 text-ivory-100'
                  : 'bg-white text-charcoal-700 hover:bg-charcoal-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-gold-500' : ''}`} />
              <span className="font-medium text-sm uppercase tracking-wider">
                {category.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="categoryIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;
