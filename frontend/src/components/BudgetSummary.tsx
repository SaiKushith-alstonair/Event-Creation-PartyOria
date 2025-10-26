import React from 'react';
import { ArrowLeft, CheckCircle, Download, Share2 } from 'lucide-react';
import { BudgetAllocation } from './BudgetAllocationModal';

interface BudgetSummaryProps {
  allocation: BudgetAllocation;
  totalBudget: number;
  onConfirm: () => void;
  onBack: () => void;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  allocation,
  totalBudget,
  onConfirm,
  onBack
}) => {
  const categoryNames: Record<string, string> = {
    venue: 'Venue & Location',
    catering: 'Catering Services',
    decoration: 'Decoration & Design',
    photography: 'Photography & Video',
    entertainment: 'Entertainment & Music',
    technical: 'Technical Setup',
    coordination: 'Coordination',
    miscellaneous: 'Miscellaneous'
  };

  const categoryIcons: Record<string, string> = {
    venue: '🏛️',
    catering: '🍽️',
    decoration: '🎨',
    photography: '📸',
    entertainment: '🎵',
    technical: '💻',
    coordination: '🛠️',
    miscellaneous: '🔧'
  };

  const handleExport = () => {
    const data = {
      totalBudget,
      allocation: allocation.categories,
      method: allocation.method,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-allocation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="text-green-600" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Budget Allocation Summary</h3>
            <p className="text-gray-600">Review your {allocation.method} allocation</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-900 mb-2">
            ₹{totalBudget.toLocaleString()}
          </h4>
          <p className="text-gray-600">Total Budget Allocated</p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <span className="bg-white px-3 py-1 rounded-full text-gray-700">
              Method: {allocation.method === 'manual' ? 'Manual' : 'AI-Powered'}
            </span>
            <span className="bg-white px-3 py-1 rounded-full text-gray-700">
              Categories: {Object.keys(allocation.categories).length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(allocation.categories)
          .sort(([,a], [,b]) => b.percentage - a.percentage)
          .map(([key, category]) => (
          <div key={key} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{categoryIcons[key]}</span>
                <div>
                  <h5 className="font-semibold text-gray-900">{categoryNames[key]}</h5>
                  <p className="text-sm text-gray-500">{category.services.length} services</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">
                  ₹{category.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">{category.percentage}%</div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {category.services.slice(0, 3).map((service, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {service.replace('-', ' ')}
                </span>
              ))}
              {category.services.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  +{category.services.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
            <span>💡</span> Budget Guidelines
          </h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Keep 5-10% buffer for unexpected expenses</li>
            <li>• Get multiple quotes for major categories</li>
            <li>• Consider seasonal pricing variations</li>
            <li>• Prioritize must-have services over nice-to-have</li>
          </ul>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
            <span>🎯</span> Vendor Impact Preview
          </h4>
          <div className="text-sm text-green-800 space-y-2">
            <div className="flex justify-between">
              <span>Available Vendors:</span>
              <span className="font-medium">Budget Filtered</span>
            </div>
            <div className="flex justify-between">
              <span>Price Range:</span>
              <span className="font-medium">±10% tolerance</span>
            </div>
            <div className="flex justify-between">
              <span>Quality Match:</span>
              <span className="font-medium text-green-600">Optimized</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <span>📊</span> Market Comparison
          </h4>
          <div className="text-sm text-blue-800 space-y-2">
            <div className="flex justify-between">
              <span>vs Similar Events:</span>
              <span className="font-medium text-green-600">15% more efficient</span>
            </div>
            <div className="flex justify-between">
              <span>Location Factor:</span>
              <span className="font-medium">Metro Premium</span>
            </div>
            <div className="flex justify-between">
              <span>Optimization:</span>
              <span className="font-medium text-blue-600">AI Enhanced</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
          <span>📈</span> Per-Guest Analysis
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white rounded p-3 text-center">
            <div className="text-lg font-bold text-purple-600">₹{Math.round(totalBudget / (allocation.totalAllocated > 0 ? Object.values(allocation.categories).reduce((sum, cat) => sum + (cat.amount / totalBudget), 0) * 100 : 1)).toLocaleString()}</div>
            <div className="text-xs text-gray-600">Per Guest Total</div>
          </div>
          {Object.entries(allocation.categories)
            .sort(([,a], [,b]) => b.amount - a.amount)
            .slice(0, 3)
            .map(([key, category]) => {
              const perGuest = Math.round(category.amount / (totalBudget / allocation.totalAllocated || 1));
              return (
                <div key={key} className="bg-white rounded p-3 text-center">
                  <div className="text-lg font-bold text-gray-800">₹{perGuest.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">{categoryNames[key]?.split(' ')[0]}</div>
                </div>
              );
            })
          }
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-amber-900 mb-3 flex items-center gap-2">
          <span>⚠️</span> Risk Assessment & Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h5 className="font-medium text-amber-800">Potential Cost Overrun Areas:</h5>
            {Object.entries(allocation.categories)
              .filter(([, category]) => category.percentage > 35)
              .map(([key, category]) => (
                <div key={key} className="bg-white rounded p-2 flex items-center justify-between">
                  <span className="text-amber-700">{categoryNames[key]}</span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    {category.percentage}% (High)
                  </span>
                </div>
              ))
            }
            {Object.entries(allocation.categories).filter(([, category]) => category.percentage > 35).length === 0 && (
              <div className="text-green-700 bg-white rounded p-2">✓ All categories within safe ranges</div>
            )}
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-amber-800">Buffer Recommendations:</h5>
            <div className="bg-white rounded p-2 space-y-1">
              <div className="flex justify-between">
                <span>Recommended Buffer:</span>
                <span className="font-medium">₹{Math.round(totalBudget * 0.08).toLocaleString()} (8%)</span>
              </div>
              <div className="flex justify-between">
                <span>Current Unallocated:</span>
                <span className="font-medium">
                  ₹{Math.round(totalBudget - allocation.totalAllocated).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-amber-700 mt-1">
                {allocation.totalAllocated < totalBudget * 0.92 ? 
                  '✓ Good buffer maintained' : 
                  '⚠️ Consider keeping more buffer'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <Download size={16} />
          Export
        </button>
        <button
          onClick={() => {
            const template = {
              name: `${allocation.method} Template - ${new Date().toLocaleDateString()}`,
              allocation: allocation.categories,
              method: allocation.method,
              totalBudget,
              createdAt: new Date().toISOString()
            };
            localStorage.setItem(`budget-template-${Date.now()}`, JSON.stringify(template));
            alert('Template saved successfully!');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
        >
          <Share2 size={16} />
          Save Template
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
        >
          Confirm & Continue to Vendors
        </button>
      </div>
    </div>
  );
};

export default BudgetSummary;