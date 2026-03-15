/**
 * Gregg Construction - Registration Page
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  HiMail,
  HiLockClosed,
  HiUser,
  HiPhone,
  HiEye,
  HiEyeOff,
} from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const { register: registerUser, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  
  const password = watch('password');
  
  const onSubmit = async (data) => {
    const userData = {
      ...data,
      username: data.email,
      role: 'client',
    };
    
    const success = await registerUser(userData);
    if (success) {
      navigate('/login', {
        state: { message: 'Account created successfully! Please sign in.' },
      });
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/assets/images/register-bg.jpg"
          alt="Modern home construction"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal-900/70" />
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="max-w-md">
            <div className="gold-line mb-8" />
            <h2 className="font-display text-4xl text-ivory-100 mb-6">
              Start Building Your Dream
            </h2>
            <p className="text-ivory-300 text-lg leading-relaxed">
              Create your account and gain access to our comprehensive project builder. Design your perfect space with ease.
            </p>
            
            {/* Features */}
            <div className="mt-12 space-y-4">
              {[
                'Interactive material selection',
                'Smart home integration options',
                'Climate-optimized recommendations',
                'Real-time project tracking',
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold-500" />
                  <span className="text-ivory-200">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-ivory-100">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-gold-500 flex items-center justify-center">
              <span className="text-charcoal-950 font-display font-bold text-2xl">G</span>
            </div>
            <span className="font-display text-xl text-charcoal-900">
              GREGG CONSTRUCTION
            </span>
          </Link>
          
          <h1 className="font-display text-display-sm text-charcoal-900 mb-2">
            Create Account
          </h1>
          <p className="text-charcoal-500 mb-10">
            Join us and start bringing your vision to life.
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {typeof error === 'string' ? error : 'Registration failed. Please try again.'}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <HiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" />
                  <input
                    type="text"
                    {...register('first_name', { required: 'Required' })}
                    className="input-luxury pl-12"
                    placeholder="John"
                  />
                </div>
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register('last_name', { required: 'Required' })}
                  className="input-luxury"
                  placeholder="Smith"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                )}
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="input-luxury pl-12"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <HiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" />
                <input
                  type="tel"
                  {...register('phone')}
                  className="input-luxury pl-12"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                  className="input-luxury pl-12 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-charcoal-400"
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password_confirm', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  className="input-luxury pl-12"
                  placeholder="••••••••"
                />
              </div>
              {errors.password_confirm && (
                <p className="mt-1 text-sm text-red-600">{errors.password_confirm.message}</p>
              )}
            </div>
            
            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                {...register('terms', { required: 'You must accept the terms' })}
                className="w-4 h-4 mt-1 border-charcoal-300 text-gold-500 focus:ring-gold-500"
              />
              <label className="ml-3 text-sm text-charcoal-600">
                I agree to the{' '}
                <Link to="/terms" className="text-gold-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-gold-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-600">{errors.terms.message}</p>
            )}
            
            <Button
              type="submit"
              variant="dark"
              size="lg"
              loading={loading}
              className="w-full mt-6"
            >
              Create Account
            </Button>
          </form>
          
          <p className="mt-10 text-center text-charcoal-600">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-600 font-semibold hover:text-gold-700">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
