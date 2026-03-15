/**
 * Gregg Construction - Estimate Page
 * Contractor view with full pricing, takeoffs, and proposal generation
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlinePrinter,
  HiOutlineMail,
  HiOutlineCurrencyDollar,
  HiOutlineCalculator,
  HiOutlineAdjustments,
  HiCheck,
} from 'react-icons/hi';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import { useProjects } from '../hooks/useProjects';
import estimateService from '../services/estimates';

const EstimatePage = () => {
  const { projectId } = useParams();
  const { currentProject, fetchProject } = useProjects();
  
  const [summary, setSummary] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [markupPercentage, setMarkupPercentage] = useState(20);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchProject(projectId);
        const summaryData = await estimateService.getProjectSummary(projectId);
        setSummary(summaryData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [projectId, fetchProject]);
  
  const handleGenerateEstimate = async () => {
    setIsGenerating(true);
    try {
      const estimateData = await estimateService.generateEstimate(projectId, {
        markup_percentage: markupPercentage,
      });
      setEstimate(estimateData);
    } catch (err) {
      console.error('Failed to generate estimate:', err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleGenerateTakeoff = async () => {
    try {
      const takeoff = await estimateService.generateTakeoff(projectId, {
        name: `Takeoff - ${currentProject?.project_name}`,
      });
      // Handle takeoff download or display
      console.log('Takeoff generated:', takeoff);
    } catch (err) {
      console.error('Failed to generate takeoff:', err);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-ivory-100">
      <Navbar />
      
      {/* Header */}
      <div className="bg-charcoal-900 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-gold-500 uppercase tracking-widest text-sm mb-2">
                Contractor View
              </p>
              <h1 className="font-display text-display-sm text-ivory-100">
                {currentProject?.project_name}
              </h1>
              <p className="text-ivory-300 mt-2">
                Full pricing breakdown and estimate generation
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 lg:mt-0 flex space-x-3"
            >
              <Button
                variant="secondary"
                className="border-ivory-300 text-ivory-300"
                icon={<HiOutlineAdjustments />}
                onClick={() => setIsSettingsOpen(true)}
              >
                Settings
              </Button>
              <Button
                variant="primary"
                icon={<HiOutlineDocumentText />}
                onClick={handleGenerateEstimate}
                loading={isGenerating}
              >
                Generate Estimate
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pricing Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Materials */}
            <Card padding="none">
              <div className="px-6 py-4 bg-charcoal-900 flex items-center justify-between">
                <h2 className="font-display text-lg text-ivory-100">
                  Materials Breakdown
                </h2>
                <span className="text-gold-500 font-semibold">
                  {formatCurrency(summary?.materials_subtotal)}
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-charcoal-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal-600 uppercase">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal-600 uppercase">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-charcoal-600 uppercase">
                        Unit Cost
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-charcoal-600 uppercase">
                        Labor
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-charcoal-600 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-100">
                    {summary?.selections?.map((selection) => (
                      <tr key={selection.id} className="hover:bg-charcoal-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-charcoal-900">
                              {selection.material?.name}
                            </p>
                            <p className="text-xs text-charcoal-500">
                              {selection.material?.brand?.name} • SKU: {selection.material?.sku || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-charcoal-700">
                          {selection.quantity} {selection.material?.unit_type}
                        </td>
                        <td className="px-6 py-4 text-right text-charcoal-700">
                          {formatCurrency(selection.material?.unit_cost)}
                        </td>
                        <td className="px-6 py-4 text-right text-charcoal-700">
                          {formatCurrency(selection.labor_cost)}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-charcoal-900">
                          {formatCurrency(selection.total_cost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            
            {/* Smart Home */}
            {summary?.smart_home_selections?.length > 0 && (
              <Card padding="none">
                <div className="px-6 py-4 bg-charcoal-900 flex items-center justify-between">
                  <h2 className="font-display text-lg text-ivory-100">
                    Smart Home Systems
                  </h2>
                  <span className="text-gold-500 font-semibold">
                    {formatCurrency(summary?.smart_home_subtotal)}
                  </span>
                </div>
                
                <div className="divide-y divide-charcoal-100">
                  {summary.smart_home_selections.map((selection) => (
                    <div key={selection.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-charcoal-900">
                          {selection.system?.name}
                        </p>
                        <p className="text-sm text-charcoal-500">
                          {selection.system?.brand?.name}
                        </p>
                      </div>
                      <span className="font-semibold text-charcoal-900">
                        {formatCurrency(selection.total_cost)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
          
          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Totals Card */}
            <Card padding="lg" variant="dark">
              <h3 className="font-display text-lg text-gold-500 mb-6">
                Estimate Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-ivory-300">Materials</span>
                  <span className="text-ivory-100">
                    {formatCurrency(summary?.materials_subtotal)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-ivory-300">Labor</span>
                  <span className="text-ivory-100">
                    {formatCurrency(summary?.labor_subtotal)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-ivory-300">Smart Home</span>
                  <span className="text-ivory-100">
                    {formatCurrency(summary?.smart_home_subtotal)}
                  </span>
                </div>
                
                <div className="border-t border-charcoal-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-ivory-300">Subtotal</span>
                    <span className="text-ivory-100">
                      {formatCurrency(
                        (summary?.materials_subtotal || 0) +
                        (summary?.labor_subtotal || 0) +
                        (summary?.smart_home_subtotal || 0)
                      )}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-ivory-300">
                    Tax ({((summary?.tax_rate || 0) * 100).toFixed(2)}%)
                  </span>
                  <span className="text-ivory-100">
                    {formatCurrency(summary?.tax_amount)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-ivory-300">
                    Markup ({markupPercentage}%)
                  </span>
                  <span className="text-ivory-100">
                    {formatCurrency(
                      ((summary?.materials_subtotal || 0) +
                      (summary?.labor_subtotal || 0) +
                      (summary?.smart_home_subtotal || 0)) *
                      (markupPercentage / 100)
                    )}
                  </span>
                </div>
                
                <div className="border-t border-charcoal-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-ivory-100 font-semibold">Total</span>
                    <span className="text-2xl text-gold-500 font-display">
                      {formatCurrency(summary?.total)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Actions Card */}
            <Card padding="lg">
              <h3 className="font-semibold text-charcoal-900 mb-4">
                Export Options
              </h3>
              
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  icon={<HiOutlineDownload />}
                  onClick={handleGenerateTakeoff}
                >
                  Download Takeoff (Excel)
                </Button>
                
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  icon={<HiOutlinePrinter />}
                >
                  Print Estimate
                </Button>
                
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  icon={<HiOutlineMail />}
                >
                  Email to Client
                </Button>
              </div>
            </Card>
            
            {/* Project Info */}
            <Card padding="lg">
              <h3 className="font-semibold text-charcoal-900 mb-4">
                Project Details
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Climate Zone</span>
                  <span className="text-charcoal-900">{summary?.climate_zone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Tax Rate</span>
                  <span className="text-charcoal-900">
                    {((summary?.tax_rate || 0) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Location</span>
                  <span className="text-charcoal-900">{summary?.location}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Estimate Settings"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Markup Percentage
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="50"
                value={markupPercentage}
                onChange={(e) => setMarkupPercentage(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="w-16 text-center font-semibold text-charcoal-900">
                {markupPercentage}%
              </span>
            </div>
          </div>
          
          <Button
            variant="primary"
            onClick={() => setIsSettingsOpen(false)}
            className="w-full"
          >
            Save Settings
          </Button>
        </div>
      </Modal>
      
      <Footer />
    </div>
  );
};

export default EstimatePage;
