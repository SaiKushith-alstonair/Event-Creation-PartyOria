import React from 'react';
import { PieChart, TrendingUp } from 'lucide-react';

interface BudgetDisplayProps {
  allocation: {
    categories: Record<string, {
      amount: number;
      percentage: number;
      services: string[];
    }>;
    totalAllocated: number;
    method: 'manual' | 'automatic';
  };
}

const BudgetDisplay: React.FC<BudgetDisplayProps> = ({ allocation }) => {
  const categoryNames: Record<string, string> = {
    venue: 'Venue & Location',
    catering: 'Food & Catering',
    decoration: 'Decoration & Design',
    photography: 'Photography & Video',
    entertainment: 'Entertainment & Music',
    miscellaneous: 'Miscellaneous'
  };

  const categoryIcons: Record<string, string> = {
    venue: '🏛️',
    catering: '🍽️',
    decoration: '🎨',
    photography: '📸',
    entertainment: '🎵',
    miscellaneous: '🛠️'
  };

  const topCategories = Object.entries(allocation.categories)
    .sort(([,a], [,b]) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <PieChart className="text-purple-600" size={20} />
        <h4 className="font-semibold text-gray-900">Budget Allocation</h4>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
          {allocation.method === 'manual' ? 'Manual' : 'AI-Powered'}
        </span>
      </div>
      
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-gray-900">
          ₹{allocation.totalAllocated.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">Total Budget</div>
      </div>

      <div className="space-y-2">
        {topCategories.map(([key, category]) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">{categoryIcons[key]}</span>
              <span className="text-sm font-medium text-gray-700">
                {categoryNames[key]}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                ₹{category.amount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">{category.percentage}%</div>
            </div>
          </div>
        ))}
        
        {Object.keys(allocation.categories).length > 3 && (
          <div className="text-center pt-2 border-t border-purple-200">
            <span className="text-xs text-purple-600">
              +{Object.keys(allocation.categories).length - 3} more categories
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetDisplay;