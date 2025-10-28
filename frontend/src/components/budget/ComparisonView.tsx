import React, { useState } from 'react';
import { Event, BudgetBreakdown } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface ComparisonViewProps {
  events: Event[];
  onClose: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ events, onClose }) => {
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [comparisonMetric, setComparisonMetric] = useState<'total' | 'per_attendee' | 'efficiency'>('total');

  const allocatedEvents = events.filter(event => 
    event.budget_allocation && Object.keys(event.budget_allocation).length > 0
  );

  const toggleEventSelection = (event: Event) => {
    setSelectedEvents(prev => {
      const isSelected = prev.some(e => e.id === event.id);
      if (isSelected) {
        return prev.filter(e => e.id !== event.id);
      } else if (prev.length < 4) { // Limit to 4 events for comparison
        return [...prev, event];
      }
      return prev;
    });
  };

  const getComparisonData = () => {
    if (selectedEvents.length < 2) return [];

    // Get all unique services across selected events
    const allServices = new Set<string>();
    selectedEvents.forEach(event => {
      if (event.budget_allocation?.allocated_budget) {
        Object.keys(event.budget_allocation.allocated_budget).forEach(service => {
          allServices.add(service);
        });
      }
    });

    return Array.from(allServices).map(service => {
      const serviceData: any = { service };
      
      selectedEvents.forEach(event => {
        const allocation = event.budget_allocation?.allocated_budget?.[service] || 0;
        let value = allocation;
        
        if (comparisonMetric === 'per_attendee') {
          value = allocation / event.form_data.attendees;
        } else if (comparisonMetric === 'efficiency') {
          value = (allocation / event.form_data.budget) * 100;
        }
        
        serviceData[`${event.event_name.substring(0, 20)}...`] = Math.round(value);
      });
      
      return serviceData;
    });
  };

  const getEventSummary = (event: Event) => {
    const allocation = event.budget_allocation;
    if (!allocation) return null;

    const totalAllocated = allocation.total_allocated;
    const efficiency = (totalAllocated / event.form_data.budget) * 100;
    const perAttendee = totalAllocated / event.form_data.attendees;

    return {
      totalBudget: event.form_data.budget,
      totalAllocated,
      efficiency,
      perAttendee,
      attendees: event.form_data.attendees,
      serviceCount: Object.keys(allocation.allocated_budget).length
    };
  };

  const comparisonData = getComparisonData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Event Comparison</h2>
            <p className="text-gray-600">Compare budget allocations across events</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={comparisonMetric}
              onChange={(e) => setComparisonMetric(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="total">Total Amount</option>
              <option value="per_attendee">Per Attendee</option>
              <option value="efficiency">Efficiency %</option>
            </select>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Event Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Select Events to Compare (Max 4) - {selectedEvents.length} selected
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
              {allocatedEvents.map(event => {
                const isSelected = selectedEvents.some(e => e.id === event.id);
                const summary = getEventSummary(event);
                
                return (
                  <div
                    key={event.id}
                    onClick={() => toggleEventSelection(event)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}\n                  >\n                    <h4 className=\"font-medium text-gray-900 mb-2 line-clamp-2\">\n                      {event.event_name}\n                    </h4>\n                    {summary && (\n                      <div className=\"text-sm text-gray-600 space-y-1\">\n                        <div>Budget: ₹{summary.totalBudget.toLocaleString()}</div>\n                        <div>Attendees: {summary.attendees}</div>\n                        <div>Efficiency: {summary.efficiency.toFixed(1)}%</div>\n                      </div>\n                    )}\n                  </div>\n                );\n              })}\n            </div>\n          </div>\n\n          {/* Comparison Results */}\n          {selectedEvents.length >= 2 && (\n            <div className=\"space-y-6\">\n              {/* Summary Comparison */}\n              <div>\n                <h3 className=\"text-lg font-semibold mb-4\">Summary Comparison</h3>\n                <div className=\"overflow-x-auto\">\n                  <table className=\"w-full border-collapse border border-gray-300\">\n                    <thead>\n                      <tr className=\"bg-gray-50\">\n                        <th className=\"border border-gray-300 px-4 py-2 text-left\">Event</th>\n                        <th className=\"border border-gray-300 px-4 py-2 text-right\">Total Budget</th>\n                        <th className=\"border border-gray-300 px-4 py-2 text-right\">Allocated</th>\n                        <th className=\"border border-gray-300 px-4 py-2 text-right\">Efficiency</th>\n                        <th className=\"border border-gray-300 px-4 py-2 text-right\">Per Attendee</th>\n                        <th className=\"border border-gray-300 px-4 py-2 text-right\">Services</th>\n                      </tr>\n                    </thead>\n                    <tbody>\n                      {selectedEvents.map(event => {\n                        const summary = getEventSummary(event);\n                        if (!summary) return null;\n                        \n                        return (\n                          <tr key={event.id} className=\"hover:bg-gray-50\">\n                            <td className=\"border border-gray-300 px-4 py-2 font-medium\">\n                              {event.event_name.length > 30 \n                                ? `${event.event_name.substring(0, 30)}...` \n                                : event.event_name}\n                            </td>\n                            <td className=\"border border-gray-300 px-4 py-2 text-right\">\n                              ₹{summary.totalBudget.toLocaleString()}\n                            </td>\n                            <td className=\"border border-gray-300 px-4 py-2 text-right\">\n                              ₹{summary.totalAllocated.toLocaleString()}\n                            </td>\n                            <td className=\"border border-gray-300 px-4 py-2 text-right\">\n                              <div className=\"flex items-center justify-end gap-1\">\n                                {summary.efficiency >= 90 ? (\n                                  <TrendingUp className=\"h-4 w-4 text-green-600\" />\n                                ) : summary.efficiency < 80 ? (\n                                  <TrendingDown className=\"h-4 w-4 text-red-600\" />\n                                ) : null}\n                                <span className={`${\n                                  summary.efficiency >= 90 ? 'text-green-600' :\n                                  summary.efficiency < 80 ? 'text-red-600' : 'text-gray-900'\n                                }`}>\n                                  {summary.efficiency.toFixed(1)}%\n                                </span>\n                              </div>\n                            </td>\n                            <td className=\"border border-gray-300 px-4 py-2 text-right\">\n                              ₹{Math.round(summary.perAttendee).toLocaleString()}\n                            </td>\n                            <td className=\"border border-gray-300 px-4 py-2 text-right\">\n                              {summary.serviceCount}\n                            </td>\n                          </tr>\n                        );\n                      })}\n                    </tbody>\n                  </table>\n                </div>\n              </div>\n\n              {/* Service-wise Comparison Chart */}\n              <div>\n                <h3 className=\"text-lg font-semibold mb-4\">\n                  Service-wise Comparison \n                  ({comparisonMetric === 'total' ? 'Total Amount' : \n                    comparisonMetric === 'per_attendee' ? 'Per Attendee' : 'Efficiency %'})\n                </h3>\n                <div className=\"bg-white rounded-lg border\">\n                  <ResponsiveContainer width=\"100%\" height={400}>\n                    <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>\n                      <CartesianGrid strokeDasharray=\"3 3\" />\n                      <XAxis \n                        dataKey=\"service\" \n                        angle={-45} \n                        textAnchor=\"end\" \n                        height={100}\n                        interval={0}\n                      />\n                      <YAxis />\n                      <Tooltip \n                        formatter={(value: number) => [\n                          comparisonMetric === 'total' ? `₹${value.toLocaleString()}` :\n                          comparisonMetric === 'per_attendee' ? `₹${value.toLocaleString()}` :\n                          `${value}%`,\n                          ''\n                        ]}\n                      />\n                      <Legend />\n                      {selectedEvents.map((event, index) => {\n                        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];\n                        const eventKey = `${event.event_name.substring(0, 20)}...`;\n                        return (\n                          <Bar \n                            key={event.id}\n                            dataKey={eventKey}\n                            fill={colors[index % colors.length]}\n                          />\n                        );\n                      })}\n                    </BarChart>\n                  </ResponsiveContainer>\n                </div>\n              </div>\n\n              {/* Insights */}\n              <div className=\"bg-blue-50 rounded-lg p-4\">\n                <h4 className=\"font-medium text-blue-900 mb-2\">Insights</h4>\n                <div className=\"text-sm text-blue-800 space-y-1\">\n                  {(() => {\n                    const efficiencies = selectedEvents.map(e => {\n                      const summary = getEventSummary(e);\n                      return { event: e.event_name, efficiency: summary?.efficiency || 0 };\n                    });\n                    \n                    const mostEfficient = efficiencies.reduce((max, curr) => \n                      curr.efficiency > max.efficiency ? curr : max\n                    );\n                    \n                    const leastEfficient = efficiencies.reduce((min, curr) => \n                      curr.efficiency < min.efficiency ? curr : min\n                    );\n                    \n                    return (\n                      <>\n                        <div>• Most efficient: {mostEfficient.event} ({mostEfficient.efficiency.toFixed(1)}%)</div>\n                        <div>• Least efficient: {leastEfficient.event} ({leastEfficient.efficiency.toFixed(1)}%)</div>\n                        <div>• Average efficiency: {(efficiencies.reduce((sum, e) => sum + e.efficiency, 0) / efficiencies.length).toFixed(1)}%</div>\n                      </>\n                    );\n                  })()}\n                </div>\n              </div>\n            </div>\n          )}\n\n          {selectedEvents.length < 2 && (\n            <div className=\"text-center py-12\">\n              <div className=\"text-gray-400 mb-4\">\n                <ArrowRight className=\"h-12 w-12 mx-auto\" />\n              </div>\n              <h3 className=\"text-lg font-medium text-gray-900 mb-2\">Select Events to Compare</h3>\n              <p className=\"text-gray-600\">Choose at least 2 events to see comparison charts and insights</p>\n            </div>\n          )}\n        </div>\n      </div>\n    </div>\n  );\n};\n\nexport default ComparisonView;