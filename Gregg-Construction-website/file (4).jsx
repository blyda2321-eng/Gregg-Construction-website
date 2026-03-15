/**
 * Gregg Construction - Luxury Footer
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-charcoal-950 text-ivory-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gold-500 flex items-center justify-center">
                <span className="text-charcoal-950 font-display font-bold text-2xl">G</span>
              </div>
            </div>
            <h3 className="font-display text-2xl text-ivory-100 mb-4">
              GREGG CONSTRUCTION
            </h3>
            <p className="text-charcoal-400 leading-relaxed">
              Crafting exceptional spaces with precision, integrity, and uncompromising quality since 1985.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Services', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-charcoal-400 hover:text-gold-400 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-6">
              Services
            </h4>
            <ul className="space-y-4">
              {[
                'Custom Homes',
                'Commercial Buildings',
                'Renovations',
                'Design-Build',
                'Smart Home Integration',
              ].map((item) => (
                <li key={item}>
                  <span className="text-charcoal-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <HiLocationMarker className="w-5 h-5 text-gold-500 mt-1 flex-shrink-0" />
                <span className="text-charcoal-400">
                  123 Construction Way<br />
                  Suite 100<br />
                  Building City, ST 12345
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <HiPhone className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <a
                  href="tel:+15551234567"
                  className="text-charcoal-400 hover:text-gold-400 transition-colors"
                >
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <HiMail className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <a
                  href="mailto:info@greggconstruction.com"
                  className="text-charcoal-400 hover:text-gold-400 transition-colors"
                >
                  *info@greggconstruction.com*
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-charcoal-500 text-sm">
              © {new Date().getFullYear()} Gregg Construction. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <Link to="/privacy" className="text-charcoal-500 hover:text-gold-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-charcoal-500 hover:text-gold-400 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
