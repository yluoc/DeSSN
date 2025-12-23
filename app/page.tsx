'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import UserProfile from './components/UserProfile';
import WalletConnection from './components/WalletConnection';

export default function SearchPage() {
  const [address, setAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedApis, setSelectedApis] = useState({
    etherscan: true,
    debank: false
  });


  const handleWalletAddressChange = (walletAddress: string) => {
    if (walletAddress) {
      setAddress(walletAddress);
      setSearchAddress(walletAddress);
      setIsWalletConnected(true);
    }
  };

  const handleWalletSearchTriggered = () => {
    // This will be called when wallet is connected and search should be triggered
    if (address.trim()) {
      setSearchAddress(address.trim());
    }
  };

  const handleManualSearch = () => {
    if (!address.trim()) return;
    if (!selectedApis.etherscan && !selectedApis.debank) {
      alert('Please select at least one data source (Etherscan or DeBank)');
      return;
    }
    console.log('Manual search for address:', address.trim());
    setSearchAddress(address.trim());
    setIsWalletConnected(false); // This is a manual search, not wallet-connected
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 relative">
          {/* Connect Wallet Button - Top Right */}
          <div className="absolute top-0 right-0">
            <WalletConnection 
              onAddressChange={handleWalletAddressChange} 
              onSearchTriggered={handleWalletSearchTriggered}
            />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blockchain Address Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Get detailed insights about any blockchain address
          </p>
        </div>

        {/* API Selection */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Select Data Sources</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedApis(prev => ({ ...prev, etherscan: !prev.etherscan }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  selectedApis.etherscan
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${selectedApis.etherscan ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm font-medium">Etherscan</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Free</span>
              </button>
              
              <button
                onClick={() => setSelectedApis(prev => ({ ...prev, debank: !prev.debank }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  selectedApis.debank
                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${selectedApis.debank ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm font-medium">DeBank</span>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Pro</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Etherscan: Free API for basic blockchain data. DeBank: Paid API for comprehensive DeFi analytics.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={isWalletConnected ? "Your wallet address" : "Enter any blockchain address"}
                className="w-full px-6 py-4 text-lg text-gray-900 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Manual Search Button */}
            {!isWalletConnected && address.trim() && (
              <button
                onClick={handleManualSearch}
                className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search Address
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        {searchAddress && (
          <div>
            {/* Search Status Indicator */}
            <div className={`max-w-4xl mx-auto mb-4 p-4 rounded-lg border ${
              isWalletConnected 
                ? 'bg-green-50 border-green-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isWalletConnected ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <span className={`text-sm font-medium ${
                  isWalletConnected ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {isWalletConnected 
                    ? 'Analyzing your connected wallet' 
                    : 'Analyzing external address'
                  }
                </span>
              </div>
              <p className={`text-xs mt-1 ${
                isWalletConnected ? 'text-green-700' : 'text-blue-700'
              }`}>
                Address: {searchAddress}
              </p>
            </div>
            
            <UserProfile address={searchAddress} selectedApis={selectedApis} />
          </div>
        )}

        {/* Instructions */}
        {!searchAddress && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Two Ways to Search</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">🔗 Connect Your Wallet</h4>
                  <p className="text-sm text-blue-700">
                    Click &quot;Connect Wallet&quot; in the top right corner to automatically analyze your own blockchain activity
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">🔍 Search Any Address</h4>
                  <p className="text-sm text-blue-700">
                    Enter any blockchain address (0x...) to analyze someone else&apos;s activity
                  </p>
                </div>
              </div>
              
              <p className="text-blue-800 text-sm">
                Get detailed analysis including ETH balance, transactions, tokens, DeFi protocols, NFTs, and Blockchain Credit Score!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}