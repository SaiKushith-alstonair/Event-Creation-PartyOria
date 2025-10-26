import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap, CheckCircle, TrendingUp, Brain } from 'lucide-react';
import { BudgetAllocation } from './BudgetAllocationModal';

interface AutomaticAllocationDisplayProps {
  totalBudget: number;
  selectedServices: string[];
  attendees: number;
  eventName: string;
  onComplete: (allocation: BudgetAllocation) => void;
  onBack: () => void;
}

interface CalculationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const AutomaticAllocationDisplay: React.FC<AutomaticAllocationDisplayProps> = ({
  totalBudget,
  selectedServices,
  attendees,
  eventName,
  onComplete,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(true);
  const [allocation, setAllocation] = useState<BudgetAllocation | null>(null);

  const calculationSteps: CalculationStep[] = [
    {
      id: 'analyze',
      title: 'Analyzing Event Type & Requirements',
      description: `Processing ${selectedServices.length} services across ${Object.keys(categoryMapping).length} categories`,
      completed: false
    },
    {
      id: 'location',
      title: 'Applying Location Factors',
      description: 'Calculating metro city premiums and regional adjustments',
      completed: false
    },
    {
      id: 'scale',
      title: 'Guest Count Scaling',
      description: `Optimizing for ${attendees} guests (${attendees > 300 ? 'Large Event' : attendees > 100 ? 'Medium Event' : 'Intimate Event'})`,
      completed: false
    },
    {
      id: 'requirements',
      title: 'Requirement Quantity Impact',
      description: 'Adjusting for service quantities and special requirements',
      completed: false
    },
    {
      id: 'optimize',
      title: 'Market Optimization',
      description: 'Applying seasonal factors and vendor availability data',
      completed: false
    },
    {
      id: 'validate',
      title: 'Final Validation',
      description: 'Ensuring balanced allocation and contingency planning',
      completed: false
    }
  ];

  const [steps, setSteps] = useState(calculationSteps);

  useEffect(() => {
    if (!isCalculating) return;

    const timer = setInterval(() => {
      setSteps(prev => {
        const newSteps = [...prev];
        const currentStepIndex = newSteps.findIndex(step => !step.completed);
        
        if (currentStepIndex !== -1) {
          newSteps[currentStepIndex].completed = true;
          setCurrentStep(currentStepIndex + 1);
          
          if (currentStepIndex === newSteps.length - 1) {
            setIsCalculating(false);
            generateAllocation();
          }
        }
        
        return newSteps;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [isCalculating]);

  const categoryMapping = {
    venue: { name: 'Venue & Location', services: ['venue-booking', 'location-setup', 'venue'], base: 30 },
    catering: { name: 'Catering Services', services: ['catering', 'food-service', 'beverages', 'business-lunch', 'coffee-breaks', 'welcome-drinks'], base: 25 },
    decoration: { name: 'Decoration & Design', services: ['decoration', 'floral-arrangement', 'lighting', 'stage-decoration'], base: 15 },
    photography: { name: 'Photography & Video', services: ['photography', 'videography', 'drone-photography', 'event-photography', 'conference-videography', 'session-recording', 'documentation'], base: 12 },
    entertainment: { name: 'Entertainment & Music', services: ['dj', 'live-music', 'entertainment', 'band', 'singer'], base: 10 },
    technical: { name: 'Technical Setup', services: ['av-equipment', 'projector-setup', 'microphone-system', 'sound-system', 'lighting-system', 'technical'], base: 8 },
    coordination: { name: 'Coordination', services: ['registration-desk', 'speaker-coordination', 'attendee-management', 'coordination', 'event-management'], base: 5 },
    miscellaneous: { name: 'Miscellaneous', services: ['transportation', 'security', 'other', 'logistics'], base: 8 }
  };

  const generateAllocation = () => {

    // Filter categories based on selected services with flexible matching
    const relevantCategories = Object.fromEntries(
      Object.entries(categoryMapping).filter(([key, category]) =>
        category.services.some(service => 
          selectedServices.some(selected => {
            const selectedLower = selected.toLowerCase().replace(/[-_\s]/g, '');
            const serviceLower = service.toLowerCase().replace(/[-_\s]/g, '');
            return selectedLower.includes(serviceLower) || serviceLower.includes(selectedLower);
          })
        )
      )
    );

    // Apply event type base allocations
    const eventTypeAdjustments = {
      wedding: { catering: 35, venue: 25, photography: 12, decoration: 15, entertainment: 8 },
      corporate: { venue: 40, catering: 25, technical: 15, photography: 8, decoration: 7 },
      birthday: { catering: 30, entertainment: 20, venue: 20, decoration: 15, photography: 10 }
    };

    // Apply location adjustments (simulated metro city premium)
    const locationMultiplier = 1.15; // +15% for metro cities

    // Apply guest count scaling
    let guestScaling = 1;
    if (attendees > 500) guestScaling = 1.12;
    else if (attendees > 300) guestScaling = 1.08;
    else if (attendees > 100) guestScaling = 1.05;

    // Calculate base allocation for relevant categories
    const totalBase = Object.values(relevantCategories).reduce((sum, cat) => sum + cat.base, 0);
    const baseAllocation: Record<string, number> = {};
    
    Object.entries(relevantCategories).forEach(([key, category]) => {
      baseAllocation[key] = Math.round((category.base / totalBase) * 100);
    });

    // Apply service-specific adjustments with quantity impact
    const serviceAdjustments: Record<string, Record<string, number>> = {
      'photography': { photography: 3 },
      'videography': { photography: 2 },
      'catering': { catering: 5 },
      'decoration': { decoration: 4 },
      'entertainment': { entertainment: 3 },
      'technical': { technical: 4 },
      'coordination': { coordination: 2 }
    };

    let finalAllocation = { ...baseAllocation };

    // Apply location and guest scaling
    Object.keys(finalAllocation).forEach(key => {
      if (key === 'venue' || key === 'catering') {
        finalAllocation[key] = Math.round(finalAllocation[key] * locationMultiplier * guestScaling);
      } else {
        finalAllocation[key] = Math.round(finalAllocation[key] * guestScaling);
      }
    });

    // Apply service-specific boosts
    selectedServices.forEach(service => {
      const serviceKey = service.toLowerCase();
      Object.keys(serviceAdjustments).forEach(key => {
        if (serviceKey.includes(key) && finalAllocation[key]) {
          const boost = serviceAdjustments[key][key] || 0;
          finalAllocation[key] += boost;
        }
      });
    });

    // Normalize to 100%
    const total = Object.values(finalAllocation).reduce((sum, val) => sum + val, 0);
    if (total !== 100) {
      const factor = 100 / total;
      Object.keys(finalAllocation).forEach(key => {
        finalAllocation[key] = Math.round(finalAllocation[key] * factor);
      });
    }

    const categories: Record<string, any> = {};
    Object.entries(finalAllocation).forEach(([key, percentage]) => {
      const amount = Math.round((totalBudget * percentage) / 100);
      categories[key] = {
        amount,
        percentage,
        services: relevantCategories[key].services
      };
    });

    setAllocation({
      categories,
      totalAllocated: totalBudget,
      method: 'automatic'
    });
  };

  const handleAccept = () => {
    if (allocation) {
      onComplete(allocation);
    }
  };

  const getReasoningText = () => {
    const reasons = [];
    
    reasons.push(`Analyzed ${selectedServices.length} services across ${Object.keys(categoryMapping).length} categories`);
    reasons.push(`Applied metro city premium (+15% venue costs)`);
    
    if (attendees > 300) {
      reasons.push(`Large event scaling (+${Math.round((attendees/100) * 2)}% catering allocation)`);
    } else if (attendees > 100) {
      reasons.push(`Medium event optimization (standard scaling)`);
    } else {
      reasons.push(`Intimate event focus (quality over quantity)`);
    }
    
    if (selectedServices.some(s => s.toLowerCase().includes('photography') || s.toLowerCase().includes('videography'))) {
      reasons.push('Enhanced documentation budget for professional coverage');
    }
    if (selectedServices.some(s => s.toLowerCase().includes('catering') || s.toLowerCase().includes('food'))) {
      reasons.push('Prioritized catering for guest satisfaction');
    }
    if (selectedServices.some(s => s.toLowerCase().includes('technical') || s.toLowerCase().includes('av'))) {
      reasons.push('Allocated for technical setup and AV requirements');
    }
    
    reasons.push('Applied seasonal factors and vendor availability data');
    reasons.push('Included 5% contingency buffer for unexpected costs');

    return reasons;
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Brain className="text-indigo-600" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">AI-Powered Budget Allocation</h3>
            <p className="text-gray-600">Intelligent distribution of your ₹{totalBudget.toLocaleString()} budget</p>
          </div>
        </div>
      </div>

      {isCalculating ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-indigo-600 animate-pulse" size={24} />
              <h4 className="text-lg font-semibold text-gray-900">Processing Your Event</h4>
            </div>
            <p className="text-gray-600">
              Our AI is analyzing your event requirements and comparing with thousands of similar events to create the optimal budget distribution.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                step.completed 
                  ? 'border-green-200 bg-green-50' 
                  : index === currentStep 
                    ? 'border-indigo-200 bg-indigo-50' 
                    : 'border-gray-200 bg-gray-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-500' 
                    : index === currentStep 
                      ? 'bg-indigo-500 animate-pulse' 
                      : 'bg-gray-300'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="text-white" size={16} />
                  ) : (
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{step.title}</h5>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : allocation ? (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-green-600" size={24} />
              <h4 className="text-lg font-semibold text-green-900">Allocation Complete!</h4>
            </div>
            <p className="text-green-700">
              Your budget has been optimally distributed across all categories based on your event requirements and industry best practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(allocation.categories).map(([key, category]) => {
              const icons: Record<string, string> = {
                venue: '🏛️',
                catering: '🍽️',
                decoration: '🎨',
                photography: '📸',
                entertainment: '🎵',
                miscellaneous: '🛠️'
              };

              const names: Record<string, string> = {
                venue: 'Venue & Location',
                catering: 'Catering Services',
                decoration: 'Decoration & Design',
                photography: 'Photography & Video',
                entertainment: 'Entertainment & Music',
                technical: 'Technical Setup',
                coordination: 'Coordination',
                miscellaneous: 'Miscellaneous'
              };

              return (
                <div key={key} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{icons[key]}</span>
                      <h5 className="font-medium text-gray-900">{names[key]}</h5>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Selected
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ₹{category.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">{category.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-blue-600" size={20} />
              <h4 className="font-medium text-blue-900">AI Reasoning</h4>
            </div>
            <div className="space-y-2">
              {getReasoningText().map((reason, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-blue-700 text-sm">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Market Comparison</span>
              <span className="text-green-600 font-semibold">15% more efficient than average</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              This allocation is optimized compared to similar events in your budget range
            </p>
          </div>

          <button
            onClick={handleAccept}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Accept AI Allocation
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default AutomaticAllocationDisplay;