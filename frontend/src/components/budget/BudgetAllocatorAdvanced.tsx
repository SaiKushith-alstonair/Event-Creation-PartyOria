import React, { useState, useEffect } from 'react';
import { Event, BudgetAllocation, BudgetBreakdown } from '../types';
import { budgetAPI } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calculator, Download, Settings, ArrowLeft, Save, RefreshCw } from 'lucide-react';

interface BudgetAllocatorAdvancedProps {
  event: Event;
  onBack: () => void;
  onAllocationComplete: (allocation: BudgetAllocation) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

const BudgetAllocatorAdvanced: React.FC<BudgetAllocatorAdvancedProps> = ({ 
  event, 
  onBack, 
  onAllocationComplete 
}) => {
  const [allocation, setAllocation] = useState<BudgetAllocation | null>(event.budget_allocation || null);
  const [breakdown, setBreakdown] = useState<BudgetBreakdown[]>([]);
  const [loading, setLoading] = useState(false);
  const [customAllocations, setCustomAllocations] = useState<{[key: string]: number}>({});
  const [showSettings, setShowSettings] = useState(false);
  const [allocationRules, setAllocationRules] = useState<any>(null);

  useEffect(() => {
    if (allocation) {
      generateBreakdown(allocation);
    }
  }, [allocation]);

  const generateBreakdown = (allocationData: BudgetAllocation) => {
    const breakdownData: BudgetBreakdown[] = [];
    const allocatedBudget = allocationData.allocated_budget;
    const total = allocationData.total_budget;

    Object.entries(allocatedBudget).forEach(([service, amount]) => {
      const percentage = (amount / total * 100);
      breakdownData.push({
        service,
        amount,
        percentage: Math.round(percentage * 10) / 10
      });
    });

    setBreakdown(breakdownData.sort((a, b) => b.amount - a.amount));
  };

  const handleAutoAllocate = async () => {
    setLoading(true);
    try {
      const result = await budgetAPI.allocateBudget(event.id);
      setAllocation(result.allocation);
      setBreakdown(result.breakdown);
      
      // Initialize custom allocations with auto-generated values
      const customAlloc: {[key: string]: number} = {};
      Object.entries(result.allocation.allocated_budget).forEach(([service, amount]) => {
        customAlloc[service] = amount;
      });
      setCustomAllocations(customAlloc);
      
      onAllocationComplete(result.allocation);
    } catch (error) {
      console.error('Error allocating budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAllocationChange = (service: string, value: number) => {
    const newCustomAllocations = { ...customAllocations, [service]: value };
    setCustomAllocations(newCustomAllocations);
    
    // Update allocation state
    if (allocation) {
      const newAllocation = {
        ...allocation,
        allocated_budget: newCustomAllocations,
        total_allocated: Object.values(newCustomAllocations).reduce((sum, val) => sum + val, 0)
      };
      setAllocation(newAllocation);
      generateBreakdown(newAllocation);
    }
  };

  const getTotalAllocated = () => {
    return Object.values(customAllocations).reduce((sum, val) => sum + val, 0);
  };

  const getRemainingBudget = () => {
    return event.form_data.budget - getTotalAllocated();
  };

  const exportData = () => {
    const data = {
      event: event.event_name,
      total_budget: allocation?.total_budget,
      allocation: allocation?.allocated_budget,
      breakdown: breakdown,
      event_details: {
        attendees: event.form_data.attendees,
        duration: event.form_data.duration,
        event_type: event.form_data.event_type
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-allocation-${event.id}.json`;
    a.click();
  };

  const saveAllocation = async () => {
    if (!allocation) return;
    
    try {
      // Here you would typically save to backend
      onAllocationComplete(allocation);
      alert('Budget allocation saved successfully!');
    } catch (error) {
      console.error('Error saving allocation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{event.event_name}</h1>
                <p className="text-gray-600">Budget Allocation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Settings size={16} />
                Settings
              </button>
              {allocation && (
                <>
                  <button
                    onClick={saveAllocation}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={exportData}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Download size={16} />
                    Export
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Event Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Total Budget</h3>
            <p className="text-3xl font-bold text-blue-600">₹{event.form_data.budget.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Attendees</h3>
            <p className="text-3xl font-bold text-green-600">{event.form_data.attendees}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Duration</h3>
            <p className="text-3xl font-bold text-purple-600">{event.form_data.duration}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Remaining</h3>
            <p className={`text-3xl font-bold ${getRemainingBudget() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{getRemainingBudget().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Generate Allocation Button */}
        {!allocation && (
          <div className="bg-white rounded-lg shadow p-6 mb-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Generate Budget Allocation</h2>
            <p className="text-gray-600 mb-6">
              Create an intelligent budget allocation based on your event details and selected services
            </p>
            <button
              onClick={handleAutoAllocate}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mx-auto"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Calculator size={20} />}
              {loading ? 'Generating...' : 'Generate Allocation'}
            </button>
          </div>
        )}

        {/* Allocation Results */}
        {allocation && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Pie Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Budget Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={breakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ service, percentage }) => `${service}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Service Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={breakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="service" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Manual Adjustment Panel */}
        {allocation && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Manual Adjustments</h3>
            <div className="space-y-4">
              {breakdown.map((item) => (
                <div key={item.service} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium">{item.service}</div>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max={event.form_data.budget}
                      value={customAllocations[item.service] || item.amount}
                      onChange={(e) => handleCustomAllocationChange(item.service, Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      value={customAllocations[item.service] || item.amount}
                      onChange={(e) => handleCustomAllocationChange(item.service, Number(e.target.value))}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="w-16 text-sm text-gray-600">
                    {((customAllocations[item.service] || item.amount) / event.form_data.budget * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Table */}
        {allocation && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Detailed Allocation</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Service</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Percentage</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Per Attendee</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">{item.service}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">₹{item.amount.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{item.percentage}%</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        ₹{Math.round(item.amount / event.form_data.attendees).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-semibold">
                    <td className="border border-gray-300 px-4 py-2">Total</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">₹{getTotalAllocated().toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {(getTotalAllocated() / event.form_data.budget * 100).toFixed(1)}%
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ₹{Math.round(getTotalAllocated() / event.form_data.attendees).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetAllocatorAdvanced;