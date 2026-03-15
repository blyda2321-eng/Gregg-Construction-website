/**
 * Gregg Construction - Luxury Home Page
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineOfficeBuilding,
  HiOutlineCube,
  HiOutlineLightBulb,
  HiArrowRight,
} from 'react-icons/hi';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Home = () => {
  const services = [
    {
      icon: HiOutlineHome,
      title: 'Custom Homes',
      description: 'Bespoke residential design and construction tailored to your lifestyle and vision.',
    },
    {
      icon: HiOutlineOfficeBuilding,
      title: 'Commercial',
      description: 'Professional commercial spaces built to elevate your business presence.',
    },
    {
      icon: HiOutlineCube,
      title: 'Design-Build',
      description: 'Seamless integration of design and construction for streamlined project delivery.',
    },
    {
      icon: HiOutlineLightBulb,
      title: 'Smart Home',
      description: 'Cutting-edge home automation and technology integration.',
    },
  ];
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-charcoal-950 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/assets/images/hero-bg.jpg"
            alt="Luxury home"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/60 via-charcoal-950/40 to-charcoal-950" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-center mb-8">
              <div className="gold-line-long" />
              <span className="mx-6 text-gold-500 uppercase tracking-[0.3em] text-sm">
                Est. 1985
              </span>
              <div className="gold-line-long" />
            </div>
            
            <h1 className="font-display text-display-lg md:text-display-xl text-ivory-100 mb-6">
              Building
              <span className="text-gold-500"> Excellence</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-ivory-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
              Crafting extraordinary spaces with precision, integrity, and an unwavering commitment to quality that stands the test of time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register">
                <Button variant="primary" size="xl" icon={<HiArrowRight />} iconPosition="right">
                  Start Your Project
                </Button>
              </Link>
              <Link to="/#portfolio">
                <Button variant="secondary" size="xl" className="border-ivory-300 text-ivory-300 hover:bg-ivory-100 hover:text-charcoal-900">
                  View Portfolio
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-ivory-400 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-gold-500 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="section-padding bg-ivory-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="gold-line mx-auto mb-6" />
            <h2 className="font-display text-display-sm text-charcoal-900 mb-4">
              Our Services
            </h2>
            <p className="text-charcoal-600 max-w-2xl mx-auto">
              From concept to completion, we deliver exceptional construction services tailored to your unique vision.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card padding="lg" className="h-full text-center group">
                  <div className="w-16 h-16 mx-auto mb-6 bg-charcoal-900 flex items-center justify-center group-hover:bg-gold-500 transition-colors duration-300">
                    <service.icon className="w-8 h-8 text-gold-500 group-hover:text-charcoal-900 transition-colors duration-300" />
                  </div>
                  <h3 className="font-display text-xl text-charcoal-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-charcoal-500">
                    {service.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section-padding bg-charcoal-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/assets/images/pattern.svg')] bg-repeat" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-display-sm text-ivory-100 mb-6">
              Ready to Build Your Vision?
            </h2>
            <p className="text-ivory-300 text-xl mb-10 max-w-2xl mx-auto">
              Create an account today and start designing your dream project with our intuitive project builder.
            </p>
            <Link to="/register">
              <Button variant="primary" size="xl">
                Create Your Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
