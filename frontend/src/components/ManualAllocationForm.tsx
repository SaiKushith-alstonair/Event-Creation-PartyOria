import React, { useState, useEffect } from 'react';
import { ArrowLeft, Info, TrendingUp } from 'lucide-react';
import { BudgetAllocation } from './BudgetAllocationModal';
import BudgetTemplateManager from './BudgetTemplateManager';

interface ManualAllocationFormProps {
  totalBudget: number;
  selectedServices: string[];
  attendees: number;
  onComplete: (allocation: BudgetAllocation) => void;
  onBack: () => void;
}

interface CategoryData {
  name: string;
  icon: string;
  services: string[];
  benchmark: { min: number; max: number; recommended: number };
  description: string;
}

const ManualAllocationForm: React.FC<ManualAllocationFormProps> = ({
  totalBudget,
  selectedServices,
  attendees,
  onComplete,
  onBack
}) => {
  const allCategories: Record<string, CategoryData> = {
    venue: {
      name: 'Venue & Location',
      icon: '🏛️',
      services: ['venue-booking', 'location-setup', 'venue'],
      benchmark: { min: 25, max: 40, recommended: 30 },
      description: 'Venue rental, setup, and location costs'
    },
    catering: {
      name: 'Catering Services',
      icon: '🍽️',
      services: ['catering', 'food-service', 'beverages', 'business-lunch', 'coffee-breaks', 'welcome-drinks', 'lunch', 'dinner', 'breakfast'],
      benchmark: { min: 20, max: 35, recommended: 25 },
      description: 'Food, beverages, and catering services'
    },
    decoration: {
      name: 'Decoration & Design',
      icon: '🎨',
      services: ['decoration', 'floral-arrangement', 'lighting', 'stage-decoration', 'backdrop'],
      benchmark: { min: 10, max: 20, recommended: 15 },
      description: 'Decorations, flowers, and aesthetic elements'
    },
    photography: {
      name: 'Photography & Video',
      icon: '📸',
      services: ['photography', 'videography', 'drone-photography', 'event-photography', 'conference-videography', 'session-recording', 'documentation'],
      benchmark: { min: 8, max: 15, recommended: 12 },
      description: 'Photography, videography, and documentation'
    },
    entertainment: {
      name: 'Entertainment & Music',
      icon: '🎵',
      services: ['dj', 'live-music', 'entertainment', 'band', 'singer'],
      benchmark: { min: 5, max: 15, recommended: 10 },
      description: 'Music, DJ, live performances, and entertainment'
    },
    technical: {
      name: 'Technical Setup',
      icon: '💻',
      services: ['av-equipment', 'projector-setup', 'microphone-system', 'sound-system', 'lighting-system', 'technical'],
      benchmark: { min: 5, max: 12, recommended: 8 },
      description: 'AV equipment, sound systems, and technical setup'
    },
    coordination: {
      name: 'Coordination',
      icon: '🛠️',
      services: ['registration-desk', 'speaker-coordination', 'attendee-management', 'coordination', 'event-management'],
      benchmark: { min: 3, max: 8, recommended: 5 },
      description: 'Event coordination and management services'
    },
    miscellaneous: {
      name: 'Miscellaneous',
      icon: '🛠️',
      services: ['transportation', 'security', 'other', 'logistics'],
      benchmark: { min: 3, max: 10, recommended: 8 },
      description: 'Transportation, security, and other services'
    }
  };

  // Filter categories based on selected services with more flexible matching
  const categories = Object.fromEntries(
    Object.entries(allCategories).filter(([key, category]) =>
      category.services.some(service => 
        selectedServices.some(selected => {
          const selectedLower = selected.toLowerCase().replace(/[-_\s]/g, '');
          const serviceLower = service.toLowerCase().replace(/[-_\s]/g, '');
          return selectedLower.includes(serviceLower) || serviceLower.includes(selectedLower);
        })
      )
    )
  );

  const [percentages, setPercentages] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    
    // Start with 0% for all categories
    Object.keys(categories).forEach(key => {
      initial[key] = 0;
    });
    
    return initial;
  });

  const [showRequirementsAnalysis, setShowRequirementsAnalysis] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const totalPercentage = Object.values(percentages).reduce((sum, val) => sum + val, 0);

  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    if (totalPercentage > 100) {
      newErrors.total = 'Total allocation exceeds 100%';
    } else if (totalPercentage < 95) {
      newErrors.total = 'Total allocation should be at least 95%';
    }

    Object.entries(percentages).forEach(([category, percentage]) => {
      const { min, max } = categories[category].benchmark;
      if (percentage < min) {
        newErrors[category] = `Below recommended minimum (${min}%)`;
      } else if (percentage > max) {
        newErrors[category] = `Above recommended maximum (${max}%)`;
      }
    });

    setErrors(newErrors);
  }, [percentages, categories]);

  const handlePercentageChange = (category: string, value: number) => {
    setPercentages(prev => ({
      ...prev,
      [category]: Math.max(0, Math.min(100, value))
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(errors).length > 0) return;

    const allocation: BudgetAllocation = {
      categories: {},
      totalAllocated: totalBudget,
      method: 'manual'
    };

    Object.entries(percentages).forEach(([category, percentage]) => {
      const amount = Math.round((totalBudget * percentage) / 100);
      allocation.categories[category] = {
        amount,
        percentage,
        services: categories[category].services
      };
    });

    onComplete(allocation);
  };

  const resetToRecommended = () => {
    const recommended: Record<string, number> = {};
    const totalRecommended = Object.values(categories).reduce((sum, cat) => sum + cat.benchmark.recommended, 0);
    const factor = 100 / totalRecommended;
    
    Object.keys(categories).forEach(key => {
      recommended[key] = Math.round(categories[key].benchmark.recommended * factor);
    });
    setPercentages(recommended);
  };

  if (showRequirementsAnalysis) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Requirements Analysis</h3>
            <p className="text-gray-600">Review your selected services before budget allocation</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-blue-600">📊</span> Service Requirements Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{selectedServices.length}</div>
              <div className="text-sm text-gray-600">Total Services</div>
              <div className="text-xs text-gray-500 mt-1">Across {Object.keys(categories).length} categories</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {selectedServices.filter(s => s.toLowerCase().includes('photography') || s.toLowerCase().includes('videography')).length}
              </div>
              <div className="text-sm text-gray-600">Documentation</div>
              <div className="text-xs text-gray-500 mt-1">Photo & Video services</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                {attendees > 300 ? 'Large' : attendees > 100 ? 'Medium' : 'Small'}
              </div>
              <div className="text-sm text-gray-600">Event Scale</div>
              <div className="text-xs text-gray-500 mt-1">{attendees} guests</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">₹{Math.round(totalBudget/attendees).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Per Guest</div>
              <div className="text-xs text-gray-500 mt-1">Budget allocation</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3">Selected Services ({selectedServices.length})</h5>
              <div className="grid grid-cols-1 gap-2 max-h-40">
                {selectedServices.map((service, index) => (
                  <div key={index} className="text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded border border-blue-200 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {service.replace(/[-_]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3">Category Breakdown</h5>
              <div className="space-y-3">
                {Object.entries(categories).map(([key, category]) => {
                  const matchingServices = selectedServices.filter(selected => 
                    category.services.some(service => {
                      const selectedLower = selected.toLowerCase().replace(/[-_\s]/g, '');
                      const serviceLower = service.toLowerCase().replace(/[-_\s]/g, '');
                      return selectedLower.includes(serviceLower) || serviceLower.includes(selectedLower);
                    })
                  );
                  return (
                    <div key={key} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium text-gray-800">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                          {matchingServices.length} services
                        </span>
                        <span className="text-xs text-gray-500">
                          {category.benchmark.recommended}% recommended
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-amber-600 text-xl">💡</span>
            <div>
              <h4 className="font-medium text-amber-900 mb-2">Budget Allocation Tips</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-amber-800">
                <div>• Start with essential categories (venue, catering)</div>
                <div>• Photography typically needs 10-15% for quality</div>
                <div>• Keep 5-10% buffer for unexpected costs</div>
                <div>• Large events need higher catering allocation</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowRequirementsAnalysis(false)}
            className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Proceed to Budget Allocation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setShowRequirementsAnalysis(true)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Manual Budget Allocation</h3>
          <p className="text-gray-600">Adjust percentages to allocate your ₹{totalBudget.toLocaleString()} budget</p>
        </div>
      </div>



      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 mt-0.5" size={20} />
          <div>
            <h4 className="font-medium text-blue-900">Smart Allocation Guidance</h4>
            <p className="text-blue-700 text-sm mb-3">
              Percentages are based on industry standards for similar events. Recommendations include location and seasonal adjustments.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white rounded p-2">
                <div className="font-medium text-blue-800">Location Factor</div>
                <div className="text-blue-600">Metro city rates (+15% venue premium)</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="font-medium text-blue-800">Event Scale</div>
                <div className="text-blue-600">{attendees > 300 ? 'Large event (+8% catering)' : attendees > 100 ? 'Medium event (standard)' : 'Intimate event (-5% logistics)'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {Object.entries(categories).map(([key, category]) => {
          const amount = Math.round((totalBudget * percentages[key]) / 100);
          const hasSelectedServices = category.services.some(service => 
            selectedServices.some(selected => {
              const selectedLower = selected.toLowerCase().replace(/[-_\s]/g, '');
              const serviceLower = service.toLowerCase().replace(/[-_\s]/g, '');
              return selectedLower.includes(serviceLower) || serviceLower.includes(selectedLower);
            })
          );

          return (
            <div key={key} className={`border rounded-lg p-4 ${hasSelectedServices ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  {hasSelectedServices && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      Selected
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">₹{amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{percentages[key]}%</div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{category.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Min: {category.benchmark.min}%</span>
                  <span>Recommended: {category.benchmark.recommended}%</span>
                  <span>Max: {category.benchmark.max}%</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={percentages[key]}
                  onChange={(e) => handlePercentageChange(key, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={percentages[key]}
                    onChange={(e) => handlePercentageChange(key, parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>

                {errors[key] && (
                  <p className="text-red-500 text-xs">{errors[key]}</p>
                )}
                
                {/* Smart Suggestions */}
                {(() => {
                  const suggestions = [];
                  if (key === 'catering' && attendees > 200 && percentages[key] < 30) {
                    suggestions.push('Large events typically need 30-35% for catering');
                  }
                  if (key === 'photography' && selectedServices.some(s => s.includes('photography')) && percentages[key] < 10) {
                    suggestions.push('Your photography needs suggest 12-15% allocation');
                  }
                  if (key === 'venue' && percentages[key] < 25) {
                    suggestions.push('Metro venues typically require 25-30% of budget');
                  }
                  return suggestions.map((suggestion, idx) => (
                    <p key={idx} className="text-amber-600 text-xs mt-1 flex items-center gap-1">
                      <span>💡</span> {suggestion}
                    </p>
                  ));
                })()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-gray-600" size={20} />
            <span className="font-medium text-gray-900">Total Allocation</span>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${totalPercentage > 100 ? 'text-red-600' : totalPercentage < 95 ? 'text-yellow-600' : 'text-green-600'}`}>
              {totalPercentage}%
            </div>
            <div className="text-sm text-gray-500">
              ₹{Math.round((totalBudget * totalPercentage) / 100).toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              totalPercentage > 100 ? 'bg-red-500' : 
              totalPercentage < 95 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(totalPercentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-white rounded p-2">
            <div className="font-medium text-gray-700">Remaining Budget</div>
            <div className={`${100 - totalPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {100 - totalPercentage}% (₹{Math.round((totalBudget * (100 - totalPercentage)) / 100).toLocaleString()})
            </div>
          </div>
          <div className="bg-white rounded p-2">
            <div className="font-medium text-gray-700">Buffer Recommended</div>
            <div className="text-blue-600">5-10% for contingencies</div>
          </div>
        </div>
        
        {errors.total && (
          <p className="text-red-500 text-sm mt-2">{errors.total}</p>
        )}
        
        {totalPercentage > 100 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            ⚠️ Total exceeds 100% - reduce allocations by {totalPercentage - 100}%
          </div>
        )}
        {totalPercentage >= 95 && totalPercentage <= 100 && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
            💡 Consider keeping 5-10% buffer for unexpected expenses
          </div>
        )}
        {totalPercentage < 90 && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            💰 You have {100 - totalPercentage}% unallocated - consider distributing remaining budget
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
          📊 Market Intelligence
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white rounded p-3">
            <div className="font-medium text-gray-700">Similar Events</div>
            <div className="text-blue-600">Events like yours typically allocate:</div>
            <div className="mt-1 space-y-1">
              <div>Venue: 25-30%</div>
              <div>Catering: 30-35%</div>
              <div>Photography: 10-15%</div>
            </div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="font-medium text-gray-700">Regional Trends</div>
            <div className="text-blue-600">Metro city averages:</div>
            <div className="mt-1 space-y-1">
              <div>Venue premium: +15%</div>
              <div>Vendor rates: +10%</div>
              <div>Peak season: +12%</div>
            </div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="font-medium text-gray-700">Success Tips</div>
            <div className="text-blue-600">High satisfaction events:</div>
            <div className="mt-1 space-y-1">
              <div>15%+ on photography</div>
              <div>Keep 8% buffer</div>
              <div>Quality over quantity</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <BudgetTemplateManager
            onLoadTemplate={(template) => {
              const newPercentages: Record<string, number> = {};
              Object.keys(categories).forEach(key => {
                const templateCategory = Object.entries(template.allocation).find(([, cat]) => 
                  categories[key] && cat.percentage > 0
                );
                newPercentages[key] = templateCategory ? templateCategory[1].percentage : 0;
              });
              setPercentages(newPercentages);
            }}
            currentAllocation={Object.fromEntries(
              Object.entries(percentages).map(([key, percentage]) => [
                key, 
                { 
                  amount: Math.round((totalBudget * percentage) / 100), 
                  percentage 
                }
              ])
            )}
            totalBudget={totalBudget}
            method="manual"
          />
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3">🎯 Quick Actions</h4>
          <div className="space-y-2">
            <button
              onClick={resetToRecommended}
              className="w-full px-3 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 text-sm"
            >
              Reset to Recommended
            </button>
            <button
              onClick={() => {
                const optimized = {...percentages};
                if (attendees > 200) optimized.catering = Math.min(optimized.catering + 5, 40);
                if (selectedServices.some(s => s.toLowerCase().includes('photography'))) optimized.photography = Math.min(optimized.photography + 3, 20);
                const total = Object.values(optimized).reduce((sum, val) => sum + val, 0);
                if (total <= 100) setPercentages(optimized);
              }}
              className="w-full px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm"
            >
              Auto-Optimize for Event
            </button>
            <button
              onClick={() => {
                const evenSplit = Math.floor(100 / Object.keys(categories).length);
                const newPercentages: Record<string, number> = {};
                Object.keys(categories).forEach(key => {
                  newPercentages[key] = evenSplit;
                });
                setPercentages(newPercentages);
              }}
              className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              Even Distribution
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={Object.keys(errors).length > 0}
          className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue with Manual Allocation
        </button>
      </div>
    </div>
  );
};

export default ManualAllocationForm;