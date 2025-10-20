'use client';

import { useState, useEffect } from 'react';

interface PerformanceMonitorProps {
  address: string;
}

export default function PerformanceMonitor({ address }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState({
    startTime: 0,
    endTime: 0,
    duration: 0,
    requestsCompleted: 0,
    totalRequests: 8
  });

  useEffect(() => {
    const startTime = Date.now();
    setMetrics(prev => ({ ...prev, startTime }));

    // Monitor when requests complete
    const checkCompletion = () => {
      const endTime = Date.now();
      setMetrics(prev => ({
        ...prev,
        endTime,
        duration: endTime - prev.startTime
      }));
    };

    // Simulate monitoring (in real app, this would be connected to actual request completion)
    const timer = setTimeout(checkCompletion, 2000); // Assume 2s for demo

    return () => clearTimeout(timer);
  }, [address]);

  const progress = (metrics.requestsCompleted / metrics.totalRequests) * 100;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Performance Metrics</h3>
        <span className="text-xs text-gray-500">
          {metrics.duration > 0 ? `${metrics.duration}ms` : 'Loading...'}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{metrics.requestsCompleted}/{metrics.totalRequests} requests</span>
        <span>
          {metrics.duration > 0 ? 
            `${Math.round(metrics.duration / metrics.totalRequests)}ms avg` : 
            'Calculating...'
          }
        </span>
      </div>
    </div>
  );
}
