import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { budgetAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Calendar, Users } from 'lucide-react';

interface AnalyticsDashboardProps {
  events: Event[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ events }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('budget');

  // Filter events with allocations
  const allocatedEvents = events.filter(event => 
    event.budget_allocation && Object.keys(event.budget_allocation).length > 0
  );

  // Budget trends over time
  const getBudgetTrends = () => {
    const trends = allocatedEvents
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map(event => ({
        date: new Date(event.created_at).toLocaleDateString(),
        budget: event.form_data.budget,
        allocated: event.budget_allocation?.total_allocated || 0,
        efficiency: ((event.budget_allocation?.total_allocated || 0) / event.form_data.budget) * 100
      }));
    
    return trends;
  };

  // Event type distribution
  const getEventTypeDistribution = () => {
    const distribution: { [key: string]: number } = {};
    
    allocatedEvents.forEach(event => {
      const type = event.form_data.event_type || 'Unknown';
      distribution[type] = (distribution[type] || 0) + 1;
    });

    return Object.entries(distribution).map(([type, count]) => ({
      name: type,
      value: count,
      percentage: (count / allocatedEvents.length) * 100
    }));
  };

  // Service allocation analysis
  const getServiceAllocationAnalysis = () => {
    const serviceData: { [key: string]: { total: number, count: number } } = {};
    
    allocatedEvents.forEach(event => {
      if (event.budget_allocation?.allocated_budget) {
        Object.entries(event.budget_allocation.allocated_budget).forEach(([service, amount]) => {
          if (!serviceData[service]) {
            serviceData[service] = { total: 0, count: 0 };
          }
          serviceData[service].total += amount;
          serviceData[service].count += 1;
        });
      }
    });

    return Object.entries(serviceData)
      .map(([service, data]) => ({
        service,
        totalAmount: data.total,
        averageAmount: data.total / data.count,
        eventCount: data.count
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  };

  // Budget efficiency by event size
  const getBudgetEfficiencyBySize = () => {
    const sizeRanges = [
      { min: 0, max: 50, label: 'Small (≤50)' },
      { min: 51, max: 150, label: 'Medium (51-150)' },
      { min: 151, max: 300, label: 'Large (151-300)' },
      { min: 301, max: Infinity, label: 'XLarge (300+)' }
    ];

    return sizeRanges.map(range => {
      const eventsInRange = allocatedEvents.filter(event => 
        event.form_data.attendees >= range.min && event.form_data.attendees <= range.max
      );

      const avgBudget = eventsInRange.length > 0 
        ? eventsInRange.reduce((sum, event) => sum + event.form_data.budget, 0) / eventsInRange.length
        : 0;

      const avgAllocated = eventsInRange.length > 0
        ? eventsInRange.reduce((sum, event) => sum + (event.budget_allocation?.total_allocated || 0), 0) / eventsInRange.length
        : 0;

      const avgPerAttendee = eventsInRange.length > 0
        ? eventsInRange.reduce((sum, event) => sum + (event.form_data.budget / event.form_data.attendees), 0) / eventsInRange.length
        : 0;

      return {
        size: range.label,
        avgBudget: Math.round(avgBudget),
        avgAllocated: Math.round(avgAllocated),
        avgPerAttendee: Math.round(avgPerAttendee),
        count: eventsInRange.length,
        efficiency: avgBudget > 0 ? (avgAllocated / avgBudget) * 100 : 0
      };
    }).filter(item => item.count > 0);
  };

  const budgetTrends = getBudgetTrends();
  const eventTypeDistribution = getEventTypeDistribution();
  const serviceAnalysis = getServiceAllocationAnalysis();
  const efficiencyBySize = getBudgetEfficiencyBySize();

  // Key metrics
  const totalBudget = allocatedEvents.reduce((sum, event) => sum + event.form_data.budget, 0);
  const totalAllocated = allocatedEvents.reduce((sum, event) => sum + (event.budget_allocation?.total_allocated || 0), 0);
  const avgEfficiency = totalBudget > 0 ? (totalAllocated / totalBudget) * 100 : 0;
  const avgBudgetPerEvent = allocatedEvents.length > 0 ? totalBudget / allocatedEvents.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Budget allocation insights and trends</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">{avgEfficiency.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Events Allocated</p>
              <p className="text-2xl font-bold text-gray-900">{allocatedEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Budget/Event</p>
              <p className="text-2xl font-bold text-gray-900">₹{avgBudgetPerEvent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Budget Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={budgetTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} />
              <Legend />
              <Line type="monotone" dataKey="budget" stroke="#8884d8" name="Total Budget" />
              <Line type="monotone" dataKey="allocated" stroke="#82ca9d" name="Allocated" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Event Type Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Event Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={eventTypeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {eventTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Service Allocation Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Service Allocation Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceAnalysis.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="service" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} />
              <Bar dataKey="totalAmount" fill="#8884d8" name="Total Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Efficiency by Event Size */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Efficiency by Event Size</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={efficiencyBySize}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="size" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="efficiency" fill="#82ca9d" name="Efficiency %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services by Total Allocation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Services by Total Allocation</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Service</th>
                  <th className="text-right py-2">Total Amount</th>
                  <th className="text-right py-2">Avg Amount</th>
                  <th className="text-right py-2">Events</th>
                </tr>
              </thead>
              <tbody>
                {serviceAnalysis.slice(0, 5).map((service, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-medium">{service.service}</td>
                    <td className="py-2 text-right">₹{service.totalAmount.toLocaleString()}</td>
                    <td className="py-2 text-right">₹{Math.round(service.averageAmount).toLocaleString()}</td>
                    <td className="py-2 text-right">{service.eventCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Efficiency Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Budget Efficiency by Size</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Event Size</th>
                  <th className="text-right py-2">Avg Budget</th>
                  <th className="text-right py-2">Efficiency</th>
                  <th className="text-right py-2">Count</th>
                </tr>
              </thead>
              <tbody>
                {efficiencyBySize.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-medium">{item.size}</td>
                    <td className="py-2 text-right">₹{item.avgBudget.toLocaleString()}</td>
                    <td className="py-2 text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                        item.efficiency >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.efficiency.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 text-right">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;