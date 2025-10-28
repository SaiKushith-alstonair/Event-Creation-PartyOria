import React, { useState, useEffect } from 'react';
import { Event, BudgetAllocation } from '../types';
import { budgetAPI } from '../services/api';
import { CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';

interface BulkAllocatorProps {
  events: Event[];
  onComplete: () => void;
}

interface AllocationJob {
  event: Event;
  status: 'pending' | 'processing' | 'completed' | 'error';
  allocation?: BudgetAllocation;
  error?: string;
}

const BulkAllocator: React.FC<BulkAllocatorProps> = ({ events, onComplete }) => {
  const [jobs, setJobs] = useState<AllocationJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);

  useEffect(() => {
    // Initialize jobs
    const initialJobs = events.map(event => ({
      event,
      status: 'pending' as const
    }));
    setJobs(initialJobs);
  }, [events]);

  const processAllAllocations = async () => {
    setIsProcessing(true);
    setCurrentJobIndex(0);

    for (let i = 0; i < jobs.length; i++) {
      setCurrentJobIndex(i);
      
      // Update job status to processing
      setJobs(prev => prev.map((job, index) => 
        index === i ? { ...job, status: 'processing' } : job
      ));

      try {
        const result = await budgetAPI.allocateBudget(jobs[i].event.id);
        
        // Update job status to completed
        setJobs(prev => prev.map((job, index) => 
          index === i ? { 
            ...job, 
            status: 'completed',
            allocation: result.allocation 
          } : job
        ));

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        // Update job status to error
        setJobs(prev => prev.map((job, index) => 
          index === i ? { 
            ...job, 
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          } : job
        ));
      }
    }

    setIsProcessing(false);
  };

  const exportResults = () => {
    const results = jobs
      .filter(job => job.status === 'completed' && job.allocation)
      .map(job => ({
        event_id: job.event.id,
        event_name: job.event.event_name,
        total_budget: job.allocation!.total_budget,
        allocation: job.allocation!.allocated_budget,
        event_details: job.allocation!.event_details
      }));

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-budget-allocations-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const getStatusIcon = (status: AllocationJob['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      case 'processing':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: AllocationJob['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
    }
  };

  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  const errorJobs = jobs.filter(job => job.status === 'error').length;
  const progress = jobs.length > 0 ? ((completedJobs + errorJobs) / jobs.length) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Bulk Budget Allocation</h2>
          <p className="text-gray-600">Process multiple events at once</p>
        </div>
        <div className="flex items-center gap-2">
          {completedJobs > 0 && (
            <button
              onClick={exportResults}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download size={16} />
              Export Results
            </button>
          )}
          <button
            onClick={onComplete}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {completedJobs + errorJobs} of {jobs.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-green-600">{completedJobs} successful</span>
          <span className="text-red-600">{errorJobs} failed</span>
        </div>
      </div>

      {/* Start Processing Button */}
      {!isProcessing && progress === 0 && (
        <div className="text-center mb-6">
          <button
            onClick={processAllAllocations}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Start Bulk Allocation
          </button>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {jobs.map((job, index) => (
          <div
            key={job.event.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              index === currentJobIndex && isProcessing ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(job.status)}
              <div>
                <h3 className="font-medium text-gray-900">{job.event.event_name}</h3>
                <p className="text-sm text-gray-600">
                  {job.event.form_data.event_type} • {job.event.form_data.attendees} attendees • ₹{job.event.form_data.budget.toLocaleString()}
                </p>
                {job.error && (
                  <p className="text-sm text-red-600 mt-1">{job.error}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
              {job.allocation && (
                <span className="text-sm text-gray-600">
                  ₹{job.allocation.total_allocated.toLocaleString()} allocated
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {progress === 100 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Events:</span>
              <span className="ml-2 font-medium">{jobs.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Successful:</span>
              <span className="ml-2 font-medium text-green-600">{completedJobs}</span>
            </div>
            <div>
              <span className="text-gray-600">Failed:</span>
              <span className="ml-2 font-medium text-red-600">{errorJobs}</span>
            </div>
          </div>
          {completedJobs > 0 && (
            <div className="mt-2">
              <span className="text-gray-600">Total Allocated:</span>
              <span className="ml-2 font-medium">
                ₹{jobs
                  .filter(job => job.allocation)
                  .reduce((sum, job) => sum + job.allocation!.total_allocated, 0)
                  .toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkAllocator;