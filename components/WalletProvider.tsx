'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ethers } from 'ethers';

// Contract addresses from deployment
const CONTRACT_ADDRESSES = {
  KRWStablecoin: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  GameItemNFT: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  GameMarketplace: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
};

// Contract ABIs
const KRW_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function mint(address to, uint256 amount)',
  'function decimals() view returns (uint8)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
] as const;

const NFT_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function gameItems(uint256 tokenId) view returns (tuple(string itemType, uint256 rarity, uint256 attack, uint256 defense, uint256 durability, string game, uint256 mintTimestamp, bool isTransferable))',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function mintGameItem(address to, string itemType, uint256 rarity, uint256 attack, uint256 defense, uint256 durability, string game, string tokenURI) returns (uint256)'
] as const;

const MARKETPLACE_ABI = [
  'function getActiveListings() view returns (tuple(uint256 tokenId, address seller, uint256 price, bool active, uint256 listingTime)[])',
  'function listItem(uint256 tokenId, uint256 price)',
  'function buyItem(uint256 tokenId) payable',
  'function getListingByTokenId(uint256 tokenId) view returns (tuple(uint256 tokenId, address seller, uint256 price, bool active, uint256 listingTime))'
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
  image?: string;
  price?: string;
  isListed?: boolean;
}

export interface WalletContextType {
  // KRW Token functions
  krwBalance: string;
  isLoadingBalance: boolean;
  mintTestTokens: () => Promise<void>;
  sendTokens: (to: string, amount: string) => Promise<void>;
  
  // NFT functions
  ownedItems: GameItem[];
  marketplaceItems: GameItem[];
  isLoadingItems: boolean;
  refreshItems: () => Promise<void>;
  refreshMarketplace: () => Promise<void>;
  buyItem: (tokenId: string, price: string) => Promise<void>;
  
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

// NFT item type to image mapping with real game card images
const getItemImage = (itemType: string, rarity: number): string => {
  // Map item types and rarities to specific card images
  const rarityBasedImages: { [key: string]: string } = {
    // High rarity items get special card designs
    'sword-5': '/nft-items/quantum_quasar_card.png',    // Legendary sword
    'sword-4': '/nft-items/vortex_vanguard_card.png',   // Epic sword
    'sword-3': '/nft-items/pin_blazer_card.png',        // Rare sword
    'armor-4': '/nft-items/aether_weaver_card.png',     // Epic armor
    'armor-3': '/nft-items/vortex_vanguard_card.png',   // Rare armor
    'shield-3': '/nft-items/pin_blazer_card.png',       // Rare shield
    'shield-2': '/nft-items/aether_weaver_card.png',    // Uncommon shield
  };

  // Try rarity-specific mapping first
  const rarityKey = `${itemType}-${rarity}`;
  if (rarityBasedImages[rarityKey]) {
    return rarityBasedImages[rarityKey];
  }

  // Fallback to item type mapping
  const baseImages: { [key: string]: string } = {
    sword: '/nft-items/quantum_quasar_card.png',
    shield: '/nft-items/pin_blazer_card.png',
    potion: '/nft-items/aether_weaver_card.png',
    armor: '/nft-items/vortex_vanguard_card.png',
  };

  // Use specific image or placeholder if not found
  return baseImages[itemType] || `https://via.placeholder.com/200x200/333/fff?text=${itemType.toUpperCase()}`;
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const [ownedItems, setOwnedItems] = useState<GameItem[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<GameItem[]>([]);
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
    watch: true,
  });

  // Get marketplace listings
  const { data: marketplaceListings, refetch: refetchMarketplace } = useContractRead({
    address: CONTRACT_ADDRESSES.GameMarketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'getActiveListings',
    enabled: isConnected,
    watch: true,
  });

  // Format KRW balance
  const krwBalance = krwBalanceData ? ethers.formatEther(krwBalanceData) : '0';

  // Mint test tokens function
  const mintTestTokens = async () => {
    if (!address) return;
    
    setIsTransacting(true);
    try {
      // This would call the actual contract in a real implementation
      // For now using the local network
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.KRWStablecoin, KRW_ABI, signer);
      
      const amount = ethers.parseEther('10000'); // 10,000 tokens
      const tx = await contract.mint(address, amount);
      await tx.wait();
      
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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.KRWStablecoin, KRW_ABI, signer);
      
      const amountWei = ethers.parseEther(amount);
      const tx = await contract.transfer(to, amountWei);
      await tx.wait();
      
      await refetchBalance();
      setLastTransaction('transfer-success');
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    } finally {
      setIsTransacting(false);
    }
  };

  // Buy item from marketplace
  const buyItem = async (tokenId: string, price: string) => {
    if (!address) return;
    
    setIsTransacting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // First approve the marketplace to spend KRW tokens
      const krwContract = new ethers.Contract(CONTRACT_ADDRESSES.KRWStablecoin, KRW_ABI, signer);
      const priceWei = ethers.parseEther(price);
      
      const approveTx = await krwContract.approve(CONTRACT_ADDRESSES.GameMarketplace, priceWei);
      await approveTx.wait();
      
      // Then buy the item
      const marketplaceContract = new ethers.Contract(CONTRACT_ADDRESSES.GameMarketplace, MARKETPLACE_ABI, signer);
      const buyTx = await marketplaceContract.buyItem(tokenId);
      await buyTx.wait();
      
      await Promise.all([refetchBalance(), refetchNftCount(), refetchMarketplace()]);
      setLastTransaction('purchase-success');
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    } finally {
      setIsTransacting(false);
    }
  };

  // Fetch owned NFT items
  const refreshItems = async () => {
    if (!address || !nftCount) {
      setOwnedItems([]);
      return;
    }
    
    setIsLoadingItems(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.GameItemNFT, NFT_ABI, provider);
      
      const items: GameItem[] = [];
      const count = Number(nftCount);
      
      for (let i = 0; i < count; i++) {
        try {
          const tokenId = await contract.tokenOfOwnerByIndex(address, i);
          const gameItem = await contract.gameItems(tokenId);
          
          items.push({
            tokenId: tokenId.toString(),
            itemType: gameItem.itemType,
            rarity: Number(gameItem.rarity),
            attack: Number(gameItem.attack),
            defense: Number(gameItem.defense),
            durability: Number(gameItem.durability),
            game: gameItem.game,
            mintTimestamp: Number(gameItem.mintTimestamp),
            isTransferable: gameItem.isTransferable,
            image: getItemImage(gameItem.itemType, Number(gameItem.rarity))
          });
        } catch (error) {
          console.error(`Error fetching NFT ${i}:`, error);
        }
      }
      
      setOwnedItems(items);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setIsLoadingItems(false);
    }
  };

  // Fetch marketplace items
  const refreshMarketplace = async () => {
    if (!marketplaceListings) {
      setMarketplaceItems([]);
      return;
    }
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const nftContract = new ethers.Contract(CONTRACT_ADDRESSES.GameItemNFT, NFT_ABI, provider);
      
      const items: GameItem[] = [];
      
      for (const listing of marketplaceListings as any[]) {
        try {
          const gameItem = await nftContract.gameItems(listing.tokenId);
          
          items.push({
            tokenId: listing.tokenId.toString(),
            itemType: gameItem.itemType,
            rarity: Number(gameItem.rarity),
            attack: Number(gameItem.attack),
            defense: Number(gameItem.defense),
            durability: Number(gameItem.durability),
            game: gameItem.game,
            mintTimestamp: Number(gameItem.mintTimestamp),
            isTransferable: gameItem.isTransferable,
            image: getItemImage(gameItem.itemType, Number(gameItem.rarity)),
            price: ethers.formatEther(listing.price),
            isListed: listing.active
          });
        } catch (error) {
          console.error(`Error fetching marketplace item ${listing.tokenId}:`, error);
        }
      }
      
      setMarketplaceItems(items);
    } catch (error) {
      console.error('Failed to fetch marketplace items:', error);
    }
  };

  // Refresh items when NFT count changes
  useEffect(() => {
    if (isConnected && address) {
      refreshItems();
    }
  }, [nftCount, address, isConnected]);

  // Refresh marketplace when listings change
  useEffect(() => {
    if (isConnected) {
      refreshMarketplace();
    }
  }, [marketplaceListings, isConnected]);

  const contextValue: WalletContextType = {
    krwBalance,
    isLoadingBalance,
    mintTestTokens,
    sendTokens,
    ownedItems,
    marketplaceItems,
    isLoadingItems,
    refreshItems,
    refreshMarketplace,
    buyItem,
    isTransacting,
    lastTransaction
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

// Global window ethereum declaration
declare global {
  interface Window {
    ethereum?: any;
  }
}
