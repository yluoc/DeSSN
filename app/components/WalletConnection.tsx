'use client';

import { useState } from 'react';
import { Wallet, Copy, ExternalLink } from 'lucide-react';

interface WalletConnectionProps {
  onAddressChange: (address: string) => void;
  onSearchTriggered?: () => void;
}

export default function WalletConnection({ onAddressChange, onSearchTriggered }: WalletConnectionProps) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          const userAddress = accounts[0];
          setAddress(userAddress);
          setConnected(true);
          onAddressChange(userAddress);
          // Automatically trigger search when wallet is connected
          if (onSearchTriggered) {
            onSearchTriggered();
          }
        }
      } else {
        alert('MetaMask is not installed. Please install MetaMask to connect your wallet.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAddress('');
    onAddressChange('');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    alert('Address copied to clipboard!');
  };

  const openEtherscan = () => {
    window.open(`https://etherscan.io/address/${address}`, '_blank');
  };

  if (connected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <Wallet className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={copyAddress}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          title="Copy address"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={openEtherscan}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          title="View on Etherscan"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        <button
          onClick={disconnectWallet}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold rounded-full border border-gray-300 hover:from-orange-500 hover:to-red-600 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Wallet className="w-5 h-5" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
    };
  }
}
