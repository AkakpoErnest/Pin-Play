'use client';

import { useEffect, useState } from 'react';

export default function MetaMaskHelper() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [metaMaskNetwork, setMetaMaskNetwork] = useState<string>('');

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsMetaMaskInstalled(true);
      
      // Get current network
      window.ethereum.request({ method: 'eth_chainId' }).then((chainId: string) => {
        const networks: { [key: string]: string } = {
          '0x1': 'Ethereum Mainnet',
          '0x5': 'Goerli Testnet',
          '0xaa36a7': 'Sepolia Testnet',
          '0x7a69': 'Hardhat Local'
        };
        setMetaMaskNetwork(networks[chainId] || `Unknown (${chainId})`);
      });
    }
  }, []);

  const switchToSepolia = async () => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia Test Network',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://sepolia.infura.io/v3/'],
            blockExplorerUrls: ['https://sepolia.etherscan.io/']
          }]
        });
      }
    }
  };

  if (!isMetaMaskInstalled) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
        <p className="text-red-700">MetaMask not detected. Please install MetaMask extension.</p>
        <a 
          href="https://metamask.io/download/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-100 border border-blue-400 rounded-lg">
      <p className="text-blue-700">
        MetaMask detected! Current network: <strong>{metaMaskNetwork}</strong>
      </p>
      {metaMaskNetwork !== 'Sepolia Testnet' && metaMaskNetwork !== 'Ethereum Mainnet' && (
        <button 
          onClick={switchToSepolia}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Switch to Sepolia Testnet
        </button>
      )}
    </div>
  );
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
