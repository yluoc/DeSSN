// Simple test component to debug API issues
'use client';

import { useState } from 'react';

interface ApiTestProps {
  selectedApis?: {
    etherscan: boolean;
    debank: boolean;
  };
}

interface TestResult {
  status: number | string;
  success: boolean;
  data: unknown;
  error: unknown;
}

export default function ApiTest({ selectedApis }: ApiTestProps) {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [loading, setLoading] = useState(false);

  const testApis = async () => {
    setLoading(true);
    const testAddress = '0xAde4611dF7a34071A1886503f2Ab7D2bc1C68bC9';
    
    const tests = [
      { name: 'Etherscan Balance', url: `/api/etherscan/balance?address=${testAddress}`, enabled: !selectedApis || selectedApis.etherscan },
      { name: 'Etherscan Transactions', url: `/api/etherscan/transactions?address=${testAddress}&offset=5`, enabled: !selectedApis || selectedApis.etherscan },
      { name: 'DeBank Chains', url: `/api/debank/chains?address=${testAddress}&type=used`, enabled: !selectedApis || selectedApis.debank },
      { name: 'DeBank Tokens', url: `/api/debank/tokens?address=${testAddress}&type=all`, enabled: !selectedApis || selectedApis.debank }
    ].filter(test => test.enabled);

    const results: Record<string, TestResult> = {};
    
    for (const test of tests) {
      try {
        console.log(`Testing ${test.name}:`, test.url);
        const response = await fetch(test.url);
        const data = await response.json();
        results[test.name] = {
          status: response.status,
          success: response.ok,
          data: response.ok ? data : null,
          error: response.ok ? null : data
        };
      } catch (error) {
        results[test.name] = {
          status: 'error',
          success: false,
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
    
    console.log('API Test Results:', results);
    setResults(results);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">API Test Results</h3>
      <button 
        onClick={testApis}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test All APIs'}
      </button>
      
      {Object.keys(results).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(results).map(([name, result]) => (
            <div key={name} className={`p-3 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">{name}</span>
                <span className={`text-sm px-2 py-1 rounded ${result.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {result.success ? 'SUCCESS' : 'FAILED'}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Status: {result.status}
              </div>
              {result.error != null && (
                <div className="text-sm text-red-600 mt-1">
                  Error: {typeof result.error === 'string' ? result.error : JSON.stringify(result.error)}
                </div>
              )}
              {result.data != null && (
                <div className="text-sm text-green-600 mt-1">
                  Data: {typeof result.data === 'string' ? result.data.substring(0, 100) : JSON.stringify(result.data).substring(0, 100)}...
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
