/**
 * Gregg Construction - Card Components
 */

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({
  children,
  variant = 'light',
  hover = true,
  padding = 'md',
  className,
  onClick,
  ...props
}) => {
  const variants = {
    light: 'bg-white',
    dark: 'bg-charcoal-900 text-ivory-100',
    glass: 'bg-white/80 backdrop-blur-md',
    bordered: 'bg-white border border-charcoal-200',
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={clsx(
        'shadow-luxury transition-all duration-500 overflow-hidden',
        hover && 'hover:shadow-luxury-lg cursor-pointer',
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className }) => (
  <div className={clsx('mb-4', className)}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={clsx('font-display text-xl', className)}>{children}</h3>
);

export const CardDescription = ({ children, className }) => (
  <p className={clsx('text-charcoal-500 text-sm mt-1', className)}>{children}</p>
);

export const CardContent = ({ children, className }) => (
  <div className={clsx(className)}>{children}</div>
);

export const CardFooter = ({ children, className }) => (
  <div className={clsx('mt-6 pt-4 border-t border-charcoal-100', className)}>
    {children}
  </div>
);

export default Card;
