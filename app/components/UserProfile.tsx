'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download, ExternalLink, TrendingUp, Wallet, Coins, Shield } from 'lucide-react';
import { downloadPDFReport } from '../lib/utils/pdfGenerator';
import CreditScoreDisplay from './CreditScoreDisplay';

interface UserProfileProps {
  address: string;
  selectedApis: {
    etherscan: boolean;
    debank: boolean;
  };
}

interface DeBankChain {
  name: string;
  community_id: number;
}

interface DeBankToken {
  symbol: string;
  name: string;
  amount: number;
  price: number;
}

interface DeBankProtocol {
  name: string;
  chain: string;
  portfolio_item_list?: unknown[];
}

interface DeBankNFT {
  name: string;
  symbol: string;
  amount: number;
}

interface EtherscanTransaction {
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  blockNumber: string;
  hash: string;
}

interface TokenTransfer {
  tokenSymbol: string;
  tokenName: string;
  value: string;
  tokenDecimal: string;
  from: string;
}

interface ProfileData {
  debank: {
    chains: DeBankChain[];
    tokens: DeBankToken[];
    protocols: DeBankProtocol[];
    nfts: DeBankNFT[];
    history: unknown[];
  };
  etherscan: {
    balance: string;
    transactions: EtherscanTransaction[];
    tokenTransfers: TokenTransfer[];
  };
}

interface LoadingState {
  chains: boolean;
  tokens: boolean;
  protocols: boolean;
  nfts: boolean;
  history: boolean;
  balance: boolean;
  transactions: boolean;
  tokenTransfers: boolean;
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
  };
  interpretation: {
    level: string;
    characteristics: string[];
  };
}

export default function UserProfile({ address, selectedApis }: UserProfileProps) {
  const [data, setData] = useState<ProfileData | null>(null);
  const [creditScoreData, setCreditScoreData] = useState<CreditScoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState<LoadingState>({
    chains: true,
    tokens: true,
    protocols: true,
    nfts: true,
    history: true,
    balance: true,
    transactions: true,
    tokenTransfers: true
  });
  const [activeTab, setActiveTab] = useState('overview');

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setLoadingStates({
      chains: selectedApis.debank,
      tokens: selectedApis.debank,
      protocols: selectedApis.debank,
      nfts: selectedApis.debank,
      history: selectedApis.debank,
      balance: selectedApis.etherscan,
      transactions: selectedApis.etherscan,
      tokenTransfers: selectedApis.etherscan
    });

    try {
      console.log('Fetching data for address:', address, 'Selected APIs:', selectedApis);
      
      const requests = [];
      
      // Only add Etherscan requests if selected
      if (selectedApis.etherscan) {
        requests.push(
          fetch(`/api/etherscan/balance?address=${address}`).then(r => r.json()),
          fetch(`/api/etherscan/transactions?address=${address}&offset=10`).then(r => r.json()),
          fetch(`/api/etherscan/token-transfers?address=${address}&tokenType=erc20&offset=10`).then(r => r.json())
        );
      }
      
      // Only add DeBank requests if selected
      if (selectedApis.debank) {
        requests.push(
          fetch(`/api/debank/chains?address=${address}&type=used`).then(r => r.json()),
          fetch(`/api/debank/tokens?address=${address}&type=all`).then(r => r.json()),
          fetch(`/api/debank/protocols?address=${address}&type=complex-all`).then(r => r.json()),
          fetch(`/api/debank/nfts?address=${address}`).then(r => r.json()),
          fetch(`/api/debank/history?address=${address}&type=all`).then(r => r.json())
        );
      }

      const results = await Promise.allSettled(requests);
      console.log('API results:', results);

      // Process results based on selected APIs
      let resultIndex = 0;
      const profileData = {
        debank: {
          chains: [],
          tokens: [],
          protocols: [],
          nfts: [],
          history: []
        },
        etherscan: {
          balance: '0',
          transactions: [],
          tokenTransfers: []
        }
      };

      // Process Etherscan results
      if (selectedApis.etherscan) {
        const balanceRes = results[resultIndex++];
        const transactionsRes = results[resultIndex++];
        const tokenTransfersRes = results[resultIndex++];
        
        profileData.etherscan = {
          balance: balanceRes.status === 'fulfilled' ? balanceRes.value.balance || '0' : '0',
          transactions: transactionsRes.status === 'fulfilled' ? transactionsRes.value.transactions || [] : [],
          tokenTransfers: tokenTransfersRes.status === 'fulfilled' ? tokenTransfersRes.value.transfers || [] : []
        };
      }

      // Process DeBank results
      if (selectedApis.debank) {
        const chainsRes = results[resultIndex++];
        const tokensRes = results[resultIndex++];
        const protocolsRes = results[resultIndex++];
        const nftsRes = results[resultIndex++];
        const historyRes = results[resultIndex++];
        
        profileData.debank = {
          chains: chainsRes.status === 'fulfilled' ? chainsRes.value.chains || [] : [],
          tokens: tokensRes.status === 'fulfilled' ? tokensRes.value.tokens || [] : [],
          protocols: protocolsRes.status === 'fulfilled' ? protocolsRes.value.protocols || [] : [],
          nfts: nftsRes.status === 'fulfilled' ? nftsRes.value.nfts || [] : [],
          history: historyRes.status === 'fulfilled' ? historyRes.value.history || [] : []
        };
      }

      console.log('Profile data set:', profileData);
      setData(profileData);

      // Update loading states
      setLoadingStates({
        chains: false,
        tokens: false,
        protocols: false,
        nfts: false,
        history: false,
        balance: false,
        transactions: false,
        tokenTransfers: false
      });

      // Fetch credit score data after profile data is loaded
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

        if (response.ok) {
          const creditScoreResult = await response.json();
          setCreditScoreData(creditScoreResult);
        }
      } catch (error) {
        console.error('Failed to fetch credit score data:', error);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // Set empty data on error
      setData({
        debank: {
          chains: [],
          tokens: [],
          protocols: [],
          nfts: [],
          history: []
        },
        etherscan: {
          balance: '0',
          transactions: [],
          tokenTransfers: []
        }
      });
    } finally {
      setLoading(false);
    }
  }, [address, selectedApis]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const formatBalance = (balance: string) => {
    return (parseInt(balance) / 1e18).toFixed(4);
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const downloadPDF = () => {
    if (!data) return;
    
    const reportData = {
      address,
      timestamp: new Date().toISOString(),
      summary: {
        totalChains: data.debank.chains.length,
        totalTokens: data.debank.tokens.length,
        totalProtocols: data.debank.protocols.length,
        totalNFTs: data.debank.nfts.length,
        ethBalance: (parseInt(data.etherscan.balance) / 1e18).toFixed(4)
      },
      data,
      creditScoreData: creditScoreData || undefined
    };

    downloadPDFReport(reportData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading address data...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load user data</p>
        <button 
          onClick={fetchUserData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {address.slice(0, 8)}...{address.slice(-6)}
            </h2>
            <p className="text-gray-600">Blockchain Address Analysis Report</p>
            <div className="mt-2 flex gap-2">
              {selectedApis.etherscan && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Etherscan Data
                </span>
              )}
              {selectedApis.debank && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  DeBank Data
                </span>
              )}
            </div>
          </div>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download PDF Report
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedApis.etherscan && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">ETH Balance</span>
                {loadingStates.balance && <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
              </div>
              <p className="text-xl font-bold text-blue-900">
                {loadingStates.balance ? 'Loading...' : `${formatBalance(data.etherscan.balance)} ETH`}
              </p>
            </div>
          )}
          
          {selectedApis.debank && (
            <>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Tokens</span>
                  {loadingStates.tokens && <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>
                <p className="text-xl font-bold text-green-900">
                  {loadingStates.tokens ? 'Loading...' : data.debank.tokens.length}
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Protocols</span>
                  {loadingStates.protocols && <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>
                <p className="text-xl font-bold text-purple-900">
                  {loadingStates.protocols ? 'Loading...' : data.debank.protocols.length}
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Chains</span>
                  {loadingStates.chains && <div className="w-3 h-3 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>
                <p className="text-xl font-bold text-orange-900">
                  {loadingStates.chains ? 'Loading...' : data.debank.chains.length}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', show: true },
              { id: 'credit-score', label: 'Credit Score', show: true },
              { id: 'tokens', label: 'Tokens', show: selectedApis.debank },
              { id: 'protocols', label: 'Protocols', show: selectedApis.debank },
              { id: 'transactions', label: 'Transactions', show: selectedApis.etherscan },
              { id: 'nfts', label: 'NFTs', show: selectedApis.debank }
            ].filter(tab => tab.show).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Address</div>
                    <div className="font-mono text-sm bg-white p-2 rounded border">{address}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Analysis Date</div>
                    <div className="text-sm font-medium">{new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {/* Active Chains (if DeBank is selected) */}
              {selectedApis.debank && data.debank.chains.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Chains</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {data.debank.chains.map((chain, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-sm font-medium text-gray-900">{chain.name}</div>
                        <div className="text-xs text-gray-500 mt-1">Chain ID: {chain.community_id}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Transactions */}
              {selectedApis.etherscan && data.etherscan.transactions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    {data.etherscan.transactions.slice(0, 5).map((tx, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${tx.from === address ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {tx.from === address ? 'Sent' : 'Received'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatBalance(tx.value)} ETH
                          </div>
                          <div className="text-xs text-gray-500">
                            Block #{tx.blockNumber}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Token Transfers */}
              {selectedApis.etherscan && data.etherscan.tokenTransfers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Token Transfers</h3>
                  <div className="space-y-3">
                    {data.etherscan.tokenTransfers.slice(0, 3).map((transfer, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Coins className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{transfer.tokenSymbol}</div>
                            <div className="text-xs text-gray-500">{transfer.tokenName}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {(parseInt(transfer.value) / Math.pow(10, parseInt(transfer.tokenDecimal))).toFixed(4)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transfer.from === address ? 'Sent' : 'Received'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Data Message */}
              {!selectedApis.etherscan && !selectedApis.debank && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No data sources selected</p>
                </div>
              )}
            </div>
          )}

          {/* Credit Score Tab */}
          {activeTab === 'credit-score' && (
            <CreditScoreDisplay address={address} selectedApis={selectedApis} />
          )}

          {/* Tokens Tab */}
          {activeTab === 'tokens' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Holdings</h3>
              {data.debank.tokens.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No token data available</p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> DeBank API requires an API key. Check <code>API_SETUP.md</code> for setup instructions.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.debank.tokens.slice(0, 10).map((token, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Coins className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{token.symbol}</div>
                          <div className="text-xs text-gray-500">{token.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {token.amount.toFixed(4)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatValue(token.price * token.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Protocols Tab */}
          {activeTab === 'protocols' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DeFi Protocols</h3>
              <div className="space-y-3">
                {data.debank.protocols.map((protocol, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{protocol.name}</div>
                      <div className="text-xs text-gray-500">{protocol.chain}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {protocol.portfolio_item_list?.length || 0} positions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
              <div className="space-y-3">
                {data.etherscan.transactions.map((tx, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {tx.from === address ? 'Sent' : 'Received'} {formatBalance(tx.value)} ETH
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}
                        </div>
                      </div>
                      <a
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="text-xs text-gray-500">
                      From: {tx.from.slice(0, 8)}...{tx.from.slice(-6)}<br />
                      To: {tx.to.slice(0, 8)}...{tx.to.slice(-6)}<br />
                      Block: #{tx.blockNumber}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NFTs Tab */}
          {activeTab === 'nfts' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">NFT Collections</h3>
              <div className="space-y-3">
                {data.debank.nfts.map((nft, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{nft.name}</div>
                      <div className="text-xs text-gray-500">{nft.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {nft.amount} tokens
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
