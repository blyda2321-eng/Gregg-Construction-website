/**
 * Gregg Construction - Login Page
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const onSubmit = async (data) => {
    const success = await login(data.email, data.password);
    if (success) {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-ivory-100">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
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
            Welcome Back
          </h1>
          <p className="text-charcoal-500 mb-10">
            Sign in to access your projects and continue building your vision.
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-charcoal-300 text-gold-500 focus:ring-gold-500"
                />
                <span className="ml-2 text-sm text-charcoal-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-gold-600 hover:text-gold-700"
              >
                Forgot password?
              </Link>
            </div>
            
            <Button
              type="submit"
              variant="dark"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>
          
          <p className="mt-10 text-center text-charcoal-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold-600 font-semibold hover:text-gold-700">
              Create one now
            </Link>
          </p>
        </motion.div>
      </div>
      
      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/assets/images/login-bg.jpg"
          alt="Luxury construction"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal-900/60" />
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="text-center">
            <h2 className="font-display text-4xl text-ivory-100 mb-4">
              Build With Confidence
            </h2>
            <p className="text-ivory-300 text-lg max-w-md">
              Join hundreds of satisfied clients who have brought their vision to life with Gregg Construction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
