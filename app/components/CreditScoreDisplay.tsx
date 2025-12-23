'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Activity, Layers, Clock, DollarSign, GitPullRequest, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface CreditScoreDisplayProps {
  address: string;
  selectedApis: {
    etherscan: boolean;
    debank: boolean;
  };
}

interface CreditScoreResponse {
  creditScore: {
    creditScore: number;
    overall: number;
    breakdown: {
      activity: number;
      diversity: number;
      longevity: number;
      value: number;
      protocol: number;
    };
    factors: {
      totalTransactions: number;
      uniqueTokens: number;
      activeChains: number;
      protocolInteractions: number;
      nftCount: number;
      accountAge: number;
      totalValue: number;
    };
  };
  interpretation: {
    level: string;
    description: string;
    characteristics: string[];
    recommendations: string[];
  };
}

export default function CreditScoreDisplay({ address, selectedApis }: CreditScoreDisplayProps) {
  const [creditScoreData, setCreditScoreData] = useState<CreditScoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreditScore = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/credit-score/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address,
            selectedApis
          })
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setCreditScoreData(result);
      } catch (err) {
        console.error('Failed to fetch credit score data:', err);
        setError('Failed to calculate Blockchain Credit Score. Ensure API keys are configured and data sources are selected.');
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchCreditScore();
    }
  }, [address, selectedApis]);

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 650) return 'text-yellow-600';
    if (score >= 600) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCreditScoreBgColor = (score: number) => {
    if (score >= 750) return 'bg-green-50 border-green-200';
    if (score >= 700) return 'bg-blue-50 border-blue-200';
    if (score >= 650) return 'bg-yellow-50 border-yellow-200';
    if (score >= 600) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Excellent': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Very Good': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'Good': return <TrendingUp className="w-5 h-5 text-yellow-600" />;
      case 'Fair': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'Poor': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const ScoreBar = ({ score, label, icon }: { score: number; label: string; icon: React.ElementType }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center text-sm font-medium text-gray-700">
          {icon && React.createElement(icon, { className: "w-4 h-4 mr-2 text-gray-500" })}
          {label}
        </div>
        <span className="text-sm font-semibold text-gray-900">{score}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Calculating Blockchain Credit Score...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Please ensure Etherscan is selected for basic data. For comprehensive scores, enable DeBank if you have a Pro API key.
        </p>
      </div>
    );
  }

  if (!creditScoreData) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No Blockchain Credit Score data available.</p>
      </div>
    );
  }

  const { creditScore, interpretation } = creditScoreData;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <CreditCard className="w-7 h-7 text-blue-600" /> Blockchain Credit Score
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Credit Score and Overall Score */}
        <div className={`p-6 rounded-lg border ${getCreditScoreBgColor(creditScore.creditScore)}`}>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Your Blockchain Credit Score</p>
            <p className={`text-5xl font-extrabold ${getCreditScoreColor(creditScore.creditScore)}`}>
              {creditScore.creditScore}
            </p>
            <p className="text-sm text-gray-600 mt-1">Range: 300-850</p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Overall Score</p>
            <p className="text-4xl font-extrabold text-gray-900">{creditScore.overall}<span className="text-2xl">/100</span></p>
          </div>
          
          <div className="flex items-center gap-2">
            {getLevelIcon(interpretation.level)}
            <span className="font-semibold text-gray-900">{interpretation.level}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">{interpretation.description}</p>
        </div>

        {/* Score Breakdown */}
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Score Breakdown</h4>
          <ScoreBar score={creditScore.breakdown.activity} label="Activity Score" icon={Activity} />
          <ScoreBar score={creditScore.breakdown.diversity} label="Diversity Score" icon={Layers} />
          <ScoreBar score={creditScore.breakdown.longevity} label="Longevity Score" icon={Clock} />
          <ScoreBar score={creditScore.breakdown.value} label="Value Score" icon={DollarSign} />
          <ScoreBar score={creditScore.breakdown.protocol} label="Protocol Score" icon={GitPullRequest} />
        </div>
      </div>

      {/* Credit Score Characteristics */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Credit Profile Characteristics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Strengths</h5>
            <ul className="space-y-1">
              {interpretation.characteristics.map((char: string, index: number) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {char}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Recommendations</h5>
            <ul className="space-y-1">
              {interpretation.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-2" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Underlying Factors */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Underlying Factors</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>Total Transactions:</span> 
            <span className="font-medium">{creditScore.factors.totalTransactions}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>Unique Tokens:</span> 
            <span className="font-medium">{creditScore.factors.uniqueTokens}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>Active Chains:</span> 
            <span className="font-medium">{creditScore.factors.activeChains}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>Protocol Interactions:</span> 
            <span className="font-medium">{creditScore.factors.protocolInteractions}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>NFT Count:</span> 
            <span className="font-medium">{creditScore.factors.nftCount}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>Account Age (Days):</span> 
            <span className="font-medium">{creditScore.factors.accountAge}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>Total Estimated Value:</span> 
            <span className="font-medium">${creditScore.factors.totalValue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
