import React, { useState } from 'react';
import { X, Calculator, Zap, CheckCircle } from 'lucide-react';
import ManualAllocationForm from './ManualAllocationForm';
import AutomaticAllocationDisplay from './AutomaticAllocationDisplay';
import BudgetSummary from './BudgetSummary';

interface BudgetAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (allocation: BudgetAllocation) => void;
  totalBudget: number;
  eventName: string;
  selectedServices: string[];
  attendees: number;
}

export interface BudgetAllocation {
  categories: Record<string, {
    amount: number;
    percentage: number;
    services: string[];
  }>;
  totalAllocated: number;
  method: 'manual' | 'automatic';
}

type Step = 'choice' | 'manual' | 'automatic' | 'summary';

const BudgetAllocationModal: React.FC<BudgetAllocationModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  totalBudget,
  eventName,
  selectedServices,
  attendees
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('choice');
  const [allocation, setAllocation] = useState<BudgetAllocation | null>(null);

  if (!isOpen) return null;

  const handleMethodChoice = (method: 'manual' | 'automatic') => {
    setCurrentStep(method);
  };

  const handleAllocationComplete = (budgetAllocation: BudgetAllocation) => {
    setAllocation(budgetAllocation);
    setCurrentStep('summary');
  };

  const handleConfirm = () => {
    if (allocation) {
      onComplete(allocation);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep === 'summary') {
      setCurrentStep(allocation?.method || 'choice');
    } else {
      setCurrentStep('choice');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">Budget Allocation</h2>
            <p className="text-purple-100">Allocate ₹{totalBudget.toLocaleString()} for {eventName}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-140px)]">
          {currentStep === 'choice' && (
            <div className="p-8">
              {/* Event Summary Card */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Event Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">₹{totalBudget.toLocaleString()}</div>
                    <div className="text-gray-600">Total Budget</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{attendees}</div>
                    <div className="text-gray-600">Guests</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedServices.length}</div>
                    <div className="text-gray-600">Services</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600">₹{Math.round(totalBudget/attendees).toLocaleString()}</div>
                    <div className="text-gray-600">Per Guest</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Selected Services:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedServices.slice(0, 6).map((service, index) => (
                      <span key={index} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {service.replace(/[-_]/g, ' ')}
                      </span>
                    ))}
                    {selectedServices.length > 6 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        +{selectedServices.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Budget Allocation for Vendor Selection
                </h3>
                <p className="text-gray-600 mb-4">Get better vendor matches within your budget</p>
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 text-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-purple-600">✨</span>
                    <span className="font-medium text-purple-900">Why allocate your budget?</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-purple-800">
                    <div className="flex items-center gap-2">
                      <span>🎯</span>
                      <span>Better vendor matches</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💰</span>
                      <span>Price-filtered options</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⚙️</span>
                      <span>Optimized recommendations</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleMethodChoice('manual')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200">
                      <Calculator className="text-purple-600" size={32} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Manual Allocation</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      I want full control over my spending
                    </p>
                    <div className="text-xs text-purple-600 space-y-1">
                      <div>• Custom percentages</div>
                      <div>• Category-by-category control</div>
                      <div>• Industry insights</div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      Best for: Experienced planners
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleMethodChoice('automatic')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200">
                      <Zap className="text-indigo-600" size={32} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Allocation</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Help me allocate optimally
                    </p>
                    <div className="text-xs text-indigo-600 space-y-1">
                      <div>• AI recommendations</div>
                      <div>• Market-based allocation</div>
                      <div>• Location-optimized</div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      Best for: First-time planners
                    </div>
                  </div>
                </button>
              </div>
              
              <div className="mt-8 text-center">
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  Skip Budget Allocation - Go to Vendor Selection
                </button>
              </div>
            </div>
          )}

          {currentStep === 'manual' && (
            <ManualAllocationForm
              totalBudget={totalBudget}
              selectedServices={selectedServices}
              attendees={attendees}
              onComplete={handleAllocationComplete}
              onBack={handleBack}
            />
          )}

          {currentStep === 'automatic' && (
            <AutomaticAllocationDisplay
              totalBudget={totalBudget}
              selectedServices={selectedServices}
              attendees={attendees}
              eventName={eventName}
              onComplete={handleAllocationComplete}
              onBack={handleBack}
            />
          )}

          {currentStep === 'summary' && allocation && (
            <BudgetSummary
              allocation={allocation}
              totalBudget={totalBudget}
              onConfirm={handleConfirm}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetAllocationModal;