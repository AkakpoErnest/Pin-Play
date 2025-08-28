'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function ChoiceWalletConnection() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="wallet-button" disabled>
        Loading...
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <div className="text-sm text-gray-600">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={() => disconnect()}
          className="btn-secondary text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="wallet-button"
      >
        Connect Wallet
      </button>
      
      {showOptions && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">Choose Wallet</h3>
            
            {/* Direct MetaMask Option */}
            <button
              onClick={() => {
                connect({ connector: injected() });
                setShowOptions(false);
              }}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🦊</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">MetaMask</div>
                <div className="text-sm text-gray-500">Direct connection</div>
              </div>
            </button>

            {/* RainbowKit Option */}
            <div className="border-t border-gray-200 pt-3">
              <div className="text-sm text-gray-600 mb-2">Or use RainbowKit:</div>
              <div className="scale-75 origin-top-left">
                <ConnectButton 
                  chainStatus="icon"
                  accountStatus="avatar"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
