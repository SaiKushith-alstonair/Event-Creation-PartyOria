import React, { useState, useEffect } from 'react';
import { Settings, Save, Upload, Download, Plus, Trash2 } from 'lucide-react';

interface AllocationRule {
  base: number;
  per_attendee: number;
  subcategories?: { [key: string]: number };
}

interface ConfigurationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ isOpen, onClose, onSave }) => {
  const [eventTypes, setEventTypes] = useState<string[]>(['Corporate Event', 'Wedding', 'Birthday Party']);
  const [selectedEventType, setSelectedEventType] = useState('Corporate Event');
  const [allocationRules, setAllocationRules] = useState<{ [eventType: string]: { [service: string]: AllocationRule } }>({
    'Corporate Event': {
      'Audio/Visual Equipment': { base: 0.15, per_attendee: 50 },
      'Catering Services': { base: 0.35, per_attendee: 200 },
      'Venue': { base: 0.25, per_attendee: 100 },
      'Logistics': { base: 0.15, per_attendee: 30 },
      'Miscellaneous': { base: 0.10, per_attendee: 20 }
    },
    'Wedding': {
      'Audio/Visual Equipment': { base: 0.12, per_attendee: 80 },
      'Catering Services': { base: 0.40, per_attendee: 300 },
      'Venue': { base: 0.30, per_attendee: 150 },
      'Logistics': { base: 0.10, per_attendee: 40 },
      'Miscellaneous': { base: 0.08, per_attendee: 30 }
    },
    'Birthday Party': {
      'Audio/Visual Equipment': { base: 0.10, per_attendee: 30 },
      'Catering Services': { base: 0.45, per_attendee: 150 },
      'Venue': { base: 0.25, per_attendee: 80 },
      'Logistics': { base: 0.10, per_attendee: 20 },
      'Miscellaneous': { base: 0.10, per_attendee: 25 }
    }
  });

  const [newServiceName, setNewServiceName] = useState('');

  const updateRule = (service: string, field: 'base' | 'per_attendee', value: number) => {
    setAllocationRules(prev => ({
      ...prev,
      [selectedEventType]: {
        ...prev[selectedEventType],
        [service]: {
          ...prev[selectedEventType][service],
          [field]: value
        }
      }
    }));
  };

  const addService = () => {
    if (newServiceName && !allocationRules[selectedEventType][newServiceName]) {
      setAllocationRules(prev => ({
        ...prev,
        [selectedEventType]: {
          ...prev[selectedEventType],
          [newServiceName]: { base: 0.1, per_attendee: 50 }
        }
      }));
      setNewServiceName('');
    }
  };

  const removeService = (service: string) => {
    setAllocationRules(prev => {
      const newRules = { ...prev };
      delete newRules[selectedEventType][service];
      return newRules;
    });
  };

  const addEventType = () => {
    const newType = prompt('Enter new event type name:');
    if (newType && !eventTypes.includes(newType)) {
      setEventTypes(prev => [...prev, newType]);
      setAllocationRules(prev => ({
        ...prev,
        [newType]: {
          'Audio/Visual Equipment': { base: 0.15, per_attendee: 50 },
          'Catering Services': { base: 0.35, per_attendee: 200 },
          'Venue': { base: 0.25, per_attendee: 100 }
        }
      }));
    }
  };

  const exportConfig = () => {
    const config = { allocation_rules: allocationRules };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget-config.json';
    a.click();
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          if (config.allocation_rules) {
            setAllocationRules(config.allocation_rules);
            setEventTypes(Object.keys(config.allocation_rules));
          }
        } catch (error) {
          alert('Invalid configuration file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    onSave({ allocation_rules: allocationRules });
    onClose();
  };

  const getTotalPercentage = () => {
    const rules = allocationRules[selectedEventType];
    return Object.values(rules).reduce((sum, rule) => sum + rule.base, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Budget Allocation Configuration</h2>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".json"
              onChange={importConfig}
              className="hidden"
              id="import-config"
            />
            <label
              htmlFor="import-config"
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <Upload size={16} />
              Import
            </label>
            <button
              onClick={exportConfig}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Event Type Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Event Types</h3>
              <button
                onClick={addEventType}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Event Type
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedEventType(type)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedEventType === type
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Allocation Rules */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Allocation Rules for {selectedEventType}
              </h3>
              <div className="text-sm text-gray-600">
                Total Base Percentage: {(getTotalPercentage() * 100).toFixed(1)}%
                {getTotalPercentage() !== 1 && (
                  <span className="text-red-600 ml-2">⚠️ Should equal 100%</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(allocationRules[selectedEventType] || {}).map(([service, rule]) => (
                <div key={service} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{service}</h4>
                    <button
                      onClick={() => removeService(service)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base Percentage
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={rule.base}
                          onChange={(e) => updateRule(service, 'base', Number(e.target.value))}
                          className="flex-1"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={(rule.base * 100).toFixed(0)}
                          onChange={(e) => updateRule(service, 'base', Number(e.target.value) / 100)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Per Attendee Cost (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={rule.per_attendee}
                        onChange={(e) => updateRule(service, 'per_attendee', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Service */}
            <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="New service name"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={addService}
                  disabled={!newServiceName}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Plus size={16} />
                  Add Service
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Preview (100 attendees, ₹1,00,000 budget)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {Object.entries(allocationRules[selectedEventType] || {}).map(([service, rule]) => {
                const baseAmount = 100000 * rule.base;
                const perAttendeeAmount = rule.per_attendee * 100;
                const total = baseAmount + perAttendeeAmount;
                return (
                  <div key={service} className="flex justify-between">
                    <span>{service}:</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save size={16} />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;