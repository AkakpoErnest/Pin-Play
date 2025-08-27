'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ethers } from 'ethers';

// Contract addresses from our deployment
const CONTRACT_ADDRESSES = {
  KRWStablecoin: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  GameItemNFT: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  GameMarketplace: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
};

// Simplified ABI for our contracts
const KRW_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function mint(address to, uint256 amount)',
  'function decimals() view returns (uint8)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
] as const;

const NFT_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function gameItems(uint256 tokenId) view returns (tuple(string itemType, uint256 rarity, uint256 attack, uint256 defense, uint256 durability, string game, uint256 mintTimestamp, bool isTransferable))',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function mintGameItem(address to, string itemType, uint256 rarity, uint256 attack, uint256 defense, uint256 durability, string game, string tokenURI) returns (uint256)'
] as const;

export interface GameItem {
  tokenId: string;
  itemType: string;
  rarity: number;
  attack: number;
  defense: number;
  durability: number;
  game: string;
  mintTimestamp: number;
  isTransferable: boolean;
}

export interface WalletContextType {
  // KRW Token functions
  krwBalance: string;
  isLoadingBalance: boolean;
  mintTestTokens: () => Promise<void>;
  sendTokens: (to: string, amount: string) => Promise<void>;
  
  // NFT functions
  ownedItems: GameItem[];
  isLoadingItems: boolean;
  refreshItems: () => Promise<void>;
  
  // Transaction state
  isTransacting: boolean;
  lastTransaction: string | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const [ownedItems, setOwnedItems] = useState<GameItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isTransacting, setIsTransacting] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<string | null>(null);

  // Get KRW balance
  const { data: krwBalanceData, isLoading: isLoadingBalance, refetch: refetchBalance } = useContractRead({
    address: CONTRACT_ADDRESSES.KRWStablecoin as `0x${string}`,
    abi: KRW_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address && isConnected,
    watch: true,
  });

  // Get NFT count for the user
  const { data: nftCount, refetch: refetchNftCount } = useContractRead({
    address: CONTRACT_ADDRESSES.GameItemNFT as `0x${string}`,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address && isConnected,
  });

  // Format KRW balance
  const krwBalance = krwBalanceData ? ethers.formatEther(krwBalanceData) : '0';

  // Mint test tokens function
  const mintTestTokens = async () => {
    if (!address) return;
    
    setIsTransacting(true);
    try {
      // For demo purposes, we'll simulate a mint transaction
      // In a real app, this would call the smart contract
      const amount = ethers.parseEther('10000'); // 10,000 tokens
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refetch balance
      await refetchBalance();
      setLastTransaction('mint-success');
    } catch (error) {
      console.error('Mint failed:', error);
      throw error;
    } finally {
      setIsTransacting(false);
    }
  };

  // Send tokens function
  const sendTokens = async (to: string, amount: string) => {
    if (!address) return;
    
    setIsTransacting(true);
    try {
      // For demo purposes, we'll simulate a transfer
      // In a real app, this would call the smart contract transfer function
      const amountWei = ethers.parseEther(amount);
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await refetchBalance();
      setLastTransaction('transfer-success');
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    } finally {
      setIsTransacting(false);
    }
  };

  // Fetch owned NFT items
  const refreshItems = async () => {
    if (!address || !nftCount) return;
    
    setIsLoadingItems(true);
    try {
      const items: GameItem[] = [];
      const count = Number(nftCount);
      
      // For demo purposes, we'll use mock data
      // In a real app, this would fetch from the smart contract
      if (count > 0) {
        const mockItems: GameItem[] = [
          {
            tokenId: '1',
            itemType: 'sword',
            rarity: 4,
            attack: 85,
            defense: 20,
            durability: 100,
            game: 'demo-rpg',
            mintTimestamp: Date.now() - 86400000,
            isTransferable: true
          },
          {
            tokenId: '2',
            itemType: 'shield',
            rarity: 3,
            attack: 10,
            defense: 75,
            durability: 100,
            game: 'demo-rpg',
            mintTimestamp: Date.now() - 172800000,
            isTransferable: true
          }
        ];
        items.push(...mockItems.slice(0, count));
      }
      
      setOwnedItems(items);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setIsLoadingItems(false);
    }
  };

  // Refresh items when NFT count changes
  useEffect(() => {
    if (nftCount) {
      refreshItems();
    } else {
      setOwnedItems([]);
    }
  }, [nftCount, address]);

  const contextValue: WalletContextType = {
    krwBalance,
    isLoadingBalance,
    mintTestTokens,
    sendTokens,
    ownedItems,
    isLoadingItems,
    refreshItems,
    isTransacting,
    lastTransaction
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}
