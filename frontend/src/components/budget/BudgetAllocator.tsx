import React, { useState } from 'react';
import { Event, BudgetAllocation, BudgetBreakdown } from '../types';
import { budgetAPI } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calculator, Download } from 'lucide-react';

interface BudgetAllocatorProps {
  event: Event;
  onAllocationComplete: (allocation: BudgetAllocation) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const BudgetAllocator: React.FC<BudgetAllocatorProps> = ({ event, onAllocationComplete }) => {
  const [allocation, setAllocation] = useState<BudgetAllocation | null>(event.budget_allocation || null);
  const [breakdown, setBreakdown] = useState<BudgetBreakdown[]>([]);
  const [loading, setLoading] = useState(false);
  const [customConfig, setCustomConfig] = useState<any>(null);

  const handleAllocate = async () => {
    setLoading(true);
    try {
      const result = await budgetAPI.allocateBudget(event.id, customConfig);
      setAllocation(result.allocation);
      setBreakdown(result.breakdown);
      onAllocationComplete(result.allocation);
    } catch (error) {
      console.error('Error allocating budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const data = {
      event: event.event_name,
      total_budget: allocation?.total_budget,
      allocation: allocation?.allocated_budget,
      breakdown: breakdown
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-allocation-${event.id}.json`;
    a.click();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Budget Allocation - {event.event_name}</h2>
        <div className="flex gap-2">
          <button
            onClick={handleAllocate}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <Calculator size={16} />
            {loading ? 'Allocating...' : 'Generate Allocation'}
          </button>
          {allocation && (
            <button
              onClick={exportData}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <Download size={16} />
              Export
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold text-gray-700">Total Budget</h3>
          <p className="text-2xl font-bold text-blue-600">₹{event.form_data.budget.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold text-gray-700">Attendees</h3>
          <p className="text-2xl font-bold text-green-600">{event.form_data.attendees}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold text-gray-700">Duration</h3>
          <p className="text-2xl font-bold text-purple-600">{event.form_data.duration}h</p>
        </div>
      </div>

      {allocation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
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

          <div>
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

      {allocation && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Detailed Allocation</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Service</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{item.service}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">₹{item.amount.toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetAllocator;