import 'server-only';

interface CreditScoreCalculationData {
  address: string;
  tokenHoldings: any[];
  transactions: any[];
  tokenTransfers: any[];
  protocols: any[];
  chains: any[];
  nfts: any[];
}

interface CreditScore {
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
  creditScore: number;
}

/**
 * Calculate Blockchain Credit Score based on blockchain activity
 * This creates a creditworthiness score based on:
 * - Transaction activity and patterns
 * - Token diversity and holdings
 * - DeFi protocol interactions
 * - Cross-chain activity
 * - NFT ownership
 * - Account longevity
 * - Portfolio value
 */
export function calculateBlockchainCreditScore(data: CreditScoreCalculationData): CreditScore {
  const { address, tokenHoldings, transactions, tokenTransfers, protocols, chains, nfts } = data;

  // Calculate individual factors
  const factors = {
    totalTransactions: transactions.length,
    uniqueTokens: new Set(tokenHoldings.map(t => t.contract_address || t.token_id)).size,
    activeChains: chains.length,
    protocolInteractions: protocols.length,
    nftCount: nfts.length,
    accountAge: calculateAccountAge(transactions),
    totalValue: calculateTotalValue(tokenHoldings)
  };

  // Calculate individual scores (0-100)
  const activityScore = Math.min(100, (factors.totalTransactions / 100) * 100);
  const diversityScore = Math.min(100, (factors.uniqueTokens / 50) * 100);
  const longevityScore = Math.min(100, (factors.accountAge / 365) * 100);
  const valueScore = Math.min(100, (factors.totalValue / 100000) * 100); // $100k = 100 points
  const protocolScore = Math.min(100, (factors.protocolInteractions / 20) * 100);

  // Weighted overall score
  const breakdown = {
    activity: Math.round(activityScore),
    diversity: Math.round(diversityScore),
    longevity: Math.round(longevityScore),
    value: Math.round(valueScore),
    protocol: Math.round(protocolScore)
  };

  const overall = Math.round(
    (breakdown.activity * 0.25) +
    (breakdown.diversity * 0.20) +
    (breakdown.longevity * 0.15) +
    (breakdown.value * 0.25) +
    (breakdown.protocol * 0.15)
  );

  // Generate credit score (300-850 range like traditional credit scores)
  const creditScore = Math.round(300 + (overall / 100) * 550);

  return {
    overall,
    breakdown,
    factors,
    creditScore
  };
}

/**
 * Calculate account age in days based on first transaction
 */
function calculateAccountAge(transactions: any[]): number {
  if (transactions.length === 0) return 0;
  
  const timestamps = transactions.map(tx => parseInt(tx.timeStamp));
  const oldestTransaction = Math.min(...timestamps);
  const now = Math.floor(Date.now() / 1000);
  
  return Math.floor((now - oldestTransaction) / (24 * 60 * 60)); // days
}

/**
 * Calculate total portfolio value in USD
 */
function calculateTotalValue(tokenHoldings: any[]): number {
  return tokenHoldings.reduce((total, token) => {
    const value = token.price * token.amount || 0;
    return total + value;
  }, 0);
}

/**
 * Get credit score interpretation and risk level
 */
export function interpretCreditScore(creditScore: CreditScore): {
  level: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent';
  description: string;
  characteristics: string[];
  recommendations: string[];
} {
  const { creditScore: score } = creditScore;

  if (score >= 750) {
    return {
      level: 'Excellent',
      description: 'Exceptional blockchain creditworthiness with extensive DeFi experience',
      characteristics: [
        'Multiple protocol interactions',
        'High transaction volume',
        'Diverse token portfolio',
        'Cross-chain activity',
        'Long account history',
        'Significant portfolio value'
      ],
      recommendations: [
        'Consider advanced DeFi strategies',
        'Explore institutional DeFi products',
        'Monitor portfolio diversification',
        'Review security practices',
        'Consider lending protocols'
      ]
    };
  } else if (score >= 700) {
    return {
      level: 'Very Good',
      description: 'Strong blockchain creditworthiness with solid DeFi participation',
      characteristics: [
        'Regular DeFi interactions',
        'Moderate to high transaction activity',
        'Good token diversity',
        'Established account history',
        'Decent portfolio value'
      ],
      recommendations: [
        'Continue exploring DeFi',
        'Consider yield farming',
        'Monitor gas costs',
        'Stay updated on new protocols',
        'Consider automated strategies'
      ]
    };
  } else if (score >= 650) {
    return {
      level: 'Good',
      description: 'Good blockchain creditworthiness with growing DeFi presence',
      characteristics: [
        'Some DeFi interactions',
        'Basic transaction patterns',
        'Limited token diversity',
        'Recent account activity',
        'Moderate portfolio value'
      ],
      recommendations: [
        'Explore more DeFi protocols',
        'Diversify token holdings',
        'Learn about yield farming',
        'Consider automated strategies',
        'Monitor portfolio performance'
      ]
    };
  } else if (score >= 600) {
    return {
      level: 'Fair',
      description: 'Fair blockchain creditworthiness with basic DeFi activity',
      characteristics: [
        'Limited DeFi interactions',
        'Basic transaction patterns',
        'Minimal token diversity',
        'Short account history',
        'Small portfolio value'
      ],
      recommendations: [
        'Start with basic DeFi protocols',
        'Learn about DEX trading',
        'Explore educational resources',
        'Consider staking opportunities',
        'Build transaction history'
      ]
    };
  } else {
    return {
      level: 'Poor',
      description: 'Poor blockchain creditworthiness with minimal DeFi activity',
      characteristics: [
        'Very limited transactions',
        'Basic token holdings',
        'Minimal protocol interactions',
        'New account or inactive',
        'Very small portfolio'
      ],
      recommendations: [
        'Start with basic DeFi protocols',
        'Learn about yield farming basics',
        'Consider DEX trading',
        'Explore educational resources',
        'Build consistent transaction history'
      ]
    };
  }
}
