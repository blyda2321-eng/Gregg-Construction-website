/**
 * Gregg Construction - Project Creation Wizard
 * Multi-step form for creating new projects
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  HiOutlineHome,
  HiOutlineOfficeBuilding,
  HiOutlineTemplate,
  HiOutlineLocationMarker,
  HiOutlineClipboardCheck,
  HiArrowRight,
  HiArrowLeft,
  HiCheck,
} from 'react-icons/hi';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useProjects } from '../hooks/useProjects';
import projectService from '../services/projects';

const ProjectCreate = () => {
  const [step, setStep] = useState(1);
  const [climateInfo, setClimateInfo] = useState(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const { createProject, loading } = useProjects();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      project_type: '',
      style: '',
      project_name: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      square_footage: '',
      num_floors: 1,
      num_bedrooms: 3,
      num_bathrooms: 2,
      garage_spaces: 2,
      client_notes: '',
    },
  });
  
  const watchedValues = watch();
  const totalSteps = 4;
  
  // Project type options
  const projectTypes = [
    {
      value: 'new_residential',
      label: 'New Residential Home',
      icon: HiOutlineHome,
      description: 'Build your dream home from the ground up',
    },
    {
      value: 'residential_remodel',
      label: 'Residential Remodel',
      icon: HiOutlineTemplate,
      description: 'Transform your existing space',
    },
    {
      value: 'commercial',
      label: 'Commercial Building',
      icon: HiOutlineOfficeBuilding,
      description: 'Professional commercial construction',
    },
    {
      value: 'multi_unit',
      label: 'Multi-Unit Housing',
      icon: HiOutlineOfficeBuilding,
      description: 'Apartments, condos, or townhomes',
    },
    {
      value: 'custom_design',
      label: 'Custom Design-Build',
      icon: HiOutlineClipboardCheck,
      description: 'Fully customized design and construction',
    },
  ];
  
  // Home style options
  const homeStyles = [
    { value: 'modern', label: 'Modern', image: '/assets/images/styles/modern.jpg' },
    { value: 'craftsman', label: 'Craftsman', image: '/assets/images/styles/craftsman.jpg' },
    { value: 'colonial', label: 'Colonial', image: '/assets/images/styles/colonial.jpg' },
    { value: 'contemporary', label: 'Contemporary', image: '/assets/images/styles/contemporary.jpg' },
    { value: 'farmhouse', label: 'Farmhouse', image: '/assets/images/styles/farmhouse.jpg' },
    { value: 'mediterranean', label: 'Mediterranean', image: '/assets/images/styles/mediterranean.jpg' },
    { value: 'ranch', label: 'Ranch', image: '/assets/images/styles/ranch.jpg' },
    { value: 'victorian', label: 'Victorian', image: '/assets/images/styles/victorian.jpg' },
    { value: 'minimalist', label: 'Minimalist', image: '/assets/images/styles/minimalist.jpg' },
    { value: 'traditional', label: 'Traditional', image: '/assets/images/styles/traditional.jpg' },
    { value: 'industrial', label: 'Industrial', image: '/assets/images/styles/industrial.jpg' },
    { value: 'custom', label: 'Custom Design', image: '/assets/images/styles/custom.jpg' },
  ];
  
  // State options
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  ];
  
  // Look up climate zone by zip code
  const lookupZipCode = async (zipCode) => {
    if (zipCode.length !== 5) return;
    
    setIsLookingUp(true);
    try {
      const data = await projectService.lookupZipCode(zipCode);
      setClimateInfo(data);
      if (data.city) setValue('city', data.city);
      if (data.state) setValue('state', data.state);
    } catch (err) {
      setClimateInfo(null);
    } finally {
      setIsLookingUp(false);
    }
  };
  
  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const project = await createProject(data);
      navigate(`/projects/${project.id}/materials`);
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };
  
  // Navigation
  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  
  // Check if current step is valid
  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!watchedValues.project_type;
      case 2:
        return !!watchedValues.style;
      case 3:
        return (
          watchedValues.project_name &&
          watchedValues.address &&
          watchedValues.city &&
          watchedValues.state &&
          watchedValues.zip_code
        );
      case 4:
        return true;
      default:
        return false;
    }
  };
  
  return (
    <div className="min-h-screen bg-ivory-100">
      <Navbar />
      
      {/* Header */}
      <div className="bg-charcoal-900 pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-gold-500 uppercase tracking-widest text-sm mb-2">
              New Project
            </p>
            <h1 className="font-display text-display-sm text-ivory-100">
              Let's Build Something Amazing
            </h1>
          </motion.div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 -mt-6">
        <Card padding="md">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((num) => (
              <React.Fragment key={num}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      step > num
                        ? 'bg-gold-500 text-charcoal-900'
                        : step === num
                        ? 'bg-charcoal-900 text-ivory-100'
                        : 'bg-charcoal-100 text-charcoal-400'
                    }`}
                  >
                    {step > num ? <HiCheck className="w-5 h-5" /> : num}
                  </div>
                  <span
                    className={`ml-3 hidden sm:block text-sm font-medium ${
                      step >= num ? 'text-charcoal-900' : 'text-charcoal-400'
                    }`}
                  >
                    {num === 1 && 'Project Type'}
                    {num === 2 && 'Style'}
                    {num === 3 && 'Location'}
                    {num === 4 && 'Details'}
                  </span>
                </div>
                {num < 4 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                      step > num ? 'bg-gold-500' : 'bg-charcoal-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 1: Project Type */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="font-display text-2xl text-charcoal-900 mb-2">
                    What type of project are you planning?
                  </h2>
                  <p className="text-charcoal-500">
                    Select the option that best describes your project
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectTypes.map((type) => (
                    <label key={type.value} className="cursor-pointer">
                      <input
                        type="radio"
                        {...register('project_type', { required: true })}
                        value={type.value}
                        className="sr-only"
                      />
                      <Card
                        padding="lg"
                        className={`h-full border-2 transition-all duration-300 ${
                          watchedValues.project_type === type.value
                            ? 'border-gold-500 bg-gold-50'
                            : 'border-transparent hover:border-charcoal-200'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-12 h-12 flex items-center justify-center transition-all duration-300 ${
                              watchedValues.project_type === type.value
                                ? 'bg-gold-500 text-charcoal-900'
                                : 'bg-charcoal-100 text-charcoal-600'
                            }`}
                          >
                            <type.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-charcoal-900">
                              {type.label}
                            </h3>
                            <p className="text-sm text-charcoal-500 mt-1">
                              {type.description}
                            </p>
                          </div>
                          {watchedValues.project_type === type.value && (
                            <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center">
                              <HiCheck className="w-4 h-4 text-charcoal-900" />
                            </div>
                          )}
                        </div>
                      </Card>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Step 2: Home Style */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="font-display text-2xl text-charcoal-900 mb-2">
                    Choose your architectural style
                  </h2>
                  <p className="text-charcoal-500">
                    Select a style that resonates with your vision
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {homeStyles.map((style) => (
                    <label key={style.value} className="cursor-pointer">
                      <input
                        type="radio"
                        {...register('style', { required: true })}
                        value={style.value}
                        className="sr-only"
                      />
                      <div
                        className={`relative overflow-hidden transition-all duration-300 ${
                          watchedValues.style === style.value
                            ? 'ring-4 ring-gold-500'
                            : 'hover:ring-2 hover:ring-charcoal-300'
                        }`}
                      >
                        <div className="aspect-square bg-charcoal-200">
                          <img
                            src={style.image}
                            alt={style.label}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div
                          className={`absolute inset-0 flex items-end transition-all duration-300 ${
                            watchedValues.style === style.value
                              ? 'bg-gold-500/80'
                              : 'bg-gradient-to-t from-charcoal-900/80 to-transparent'
                          }`}
                        >
                          <span
                            className={`w-full text-center py-3 font-semibold text-sm ${
                              watchedValues.style === style.value
                                ? 'text-charcoal-900'
                                : 'text-ivory-100'
                            }`}
                          >
                            {style.label}
                          </span>
                        </div>
                        {watchedValues.style === style.value && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-charcoal-900 rounded-full flex items-center justify-center">
                            <HiCheck className="w-4 h-4 text-gold-500" />
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Step 3: Location */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="font-display text-2xl text-charcoal-900 mb-2">
                    Where will your project be built?
                  </h2>
                  <p className="text-charcoal-500">
                    We'll optimize material recommendations for your climate zone
                  </p>
                </div>
                
                <Card padding="lg">
                  <div className="space-y-6">
                    {/* Project Name */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        {...register('project_name', { required: 'Project name is required' })}
                        className="input-luxury"
                        placeholder="e.g., Smith Family Residence"
                      />
                      {errors.project_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.project_name.message}</p>
                      )}
                    </div>
                    
                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        {...register('address', { required: 'Address is required' })}
                        className="input-luxury"
                        placeholder="123 Main Street"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                      )}
                    </div>
                    
                    {/* City, State, Zip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-charcoal-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          {...register('city', { required: 'City is required' })}
                          className="input-luxury"
                          placeholder="City"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-2">
                          State *
                        </label>
                        <select
                          {...register('state', { required: 'State is required' })}
                          className="input-luxury"
                        >
                          <option value="">Select</option>
                          {states.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-2">
                          ZIP Code *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            {...register('zip_code', {
                              required: 'ZIP is required',
                              pattern: {
                                value: /^\d{5}$/,
                                message: 'Invalid ZIP',
                              },
                              onChange: (e) => {
                                if (e.target.value.length === 5) {
                                  lookupZipCode(e.target.value);
                                }
                              },
                            })}
                            className="input-luxury"
                            placeholder="12345"
                            maxLength={5}
                          />
                          {isLookingUp && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                              <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Climate Zone Info */}
                    {climateInfo && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gold-50 border-l-4 border-gold-500"
                      >
                        <div className="flex items-start space-x-3">
                          <HiOutlineLocationMarker className="w-5 h-5 text-gold-600 mt-0.5" />
                          <div>
                            <p className="font-semibold text-charcoal-900">
                              Climate Zone: {climateInfo.climate_zone?.name}
                            </p>
                            <p className="text-sm text-charcoal-600 mt-1">
                              Materials will be automatically filtered to match your region's climate requirements, including proper insulation values, roofing materials, and landscaping options.
                            </p>
                            {climateInfo.tax_rate > 0 && (
                              <p className="text-sm text-charcoal-500 mt-2">
                                Local tax rate: {(climateInfo.tax_rate * 100).toFixed(2)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
            
            {/* Step 4: Details */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="font-display text-2xl text-charcoal-900 mb-2">
                    Tell us more about your project
                  </h2>
                  <p className="text-charcoal-500">
                    These details help us provide better recommendations
                  </p>
                </div>
                
                <Card padding="lg">
                  <div className="space-y-6">
                    {/* Square Footage */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Estimated Square Footage
                      </label>
                      <input
                        type="number"
                        {...register('square_footage')}
                        className="input-luxury"
                        placeholder="e.g., 2500"
                      />
                    </div>
                    
                    {/* Floors, Bedrooms, Bathrooms, Garage */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-2">
                          Floors
                        </label>
                        <select
                          {...register('num_floors')}
                          className="input-luxury"
                        >
                          {[1, 2, 3, 4].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-2">
                          Bedrooms
                        </label>
                        <select
                          {...register('num_bedrooms')}
                          className="input-luxury"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-2">
                          Bathrooms
                        </label>
                        <select
                          {...register('num_bathrooms')}
                          className="input-luxury"
                        >
                          {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-2">
                          Garage Spaces
                        </label>
                        <select
                          {...register('garage_spaces')}
                          className="input-luxury"
                        >
                          {[0, 1, 2, 3, 4].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Additional Notes or Requirements
                      </label>
                      <textarea
                        {...register('client_notes')}
                        rows={4}
                        className="input-luxury resize-none"
                        placeholder="Tell us about any specific features, requirements, or ideas you have for your project..."
                      />
                    </div>
                    
                    {/* Summary */}
                    <div className="p-6 bg-charcoal-900 text-ivory-100">
                      <h3 className="font-display text-lg text-gold-500 mb-4">
                        Project Summary
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-charcoal-400">Project Type:</span>
                          <p className="font-medium">
                            {projectTypes.find((t) => t.value === watchedValues.project_type)?.label}
                          </p>
                        </div>
                        <div>
                          <span className="text-charcoal-400">Style:</span>
                          <p className="font-medium capitalize">{watchedValues.style}</p>
                        </div>
                        <div>
                          <span className="text-charcoal-400">Location:</span>
                          <p className="font-medium">
                            {watchedValues.city}, {watchedValues.state}
                          </p>
                        </div>
                        <div>
                          <span className="text-charcoal-400">Size:</span>
                          <p className="font-medium">
                            {watchedValues.square_footage
                              ? `${watchedValues.square_footage} sq ft`
                              : 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={prevStep}
                icon={<HiArrowLeft />}
              >
                Back
              </Button>
            ) : (
              <div />
            )}
            
            {step < totalSteps ? (
              <Button
                type="button"
                variant="primary"
                onClick={nextStep}
                disabled={!isStepValid()}
                icon={<HiArrowRight />}
                iconPosition="right"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={<HiCheck />}
                iconPosition="right"
              >
                Create Project & Select Materials
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreate;
