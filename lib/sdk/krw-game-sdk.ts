/**
 * KRW Game Credits SDK
 * Easy integration for game developers
 */

import { ethers } from 'ethers';

export interface SDKConfig {
  rpcUrl: string;
  privateKey?: string;
  contractAddresses: {
    krwStablecoin: string;
    gameItemNFT: string;
    gameMarketplace: string;
  };
  gameId: string;
}

export interface GameItem {
  name: string;
  type: string;
  rarity: number; // 1-5
  attack: number;
  defense: number;
  durability: number;
  metadataUri: string;
}

export interface PurchaseRequest {
  itemId: number;
  buyerAddress: string;
  paymentAmount: string; // in wei
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export class KRWGameSDK {
  private provider: ethers.JsonRpcProvider;
  private wallet?: ethers.Wallet;
  private contracts: {
    krwStablecoin?: ethers.Contract;
    gameItemNFT?: ethers.Contract;
    gameMarketplace?: ethers.Contract;
  } = {};
  private config: SDKConfig;

  // Contract ABIs (simplified for demo)
  private static readonly KRWGC_ABI = [
    'function transfer(address to, uint256 amount) public returns (bool)',
    'function balanceOf(address account) public view returns (uint256)',
    'function approve(address spender, uint256 amount) public returns (bool)',
    'function mint(address to, uint256 amount) public',
    'event Transfer(address indexed from, address indexed to, uint256 value)'
  ];

  private static readonly NFT_ABI = [
    'function mintGameItem(address to, string itemType, uint256 rarity, uint256 attack, uint256 defense, uint256 durability, string game, string tokenURI) public returns (uint256)',
    'function ownerOf(uint256 tokenId) public view returns (address)',
    'function getItemsByOwner(address owner) public view returns (uint256[])',
    'function gameItems(uint256 tokenId) public view returns (tuple(string itemType, uint256 rarity, uint256 attack, uint256 defense, uint256 durability, string game, uint256 mintTimestamp, bool isTransferable))'
  ];

  private static readonly MARKETPLACE_ABI = [
    'function buyItem(uint256 tokenId) public',
    'function listItem(uint256 tokenId, uint256 price) public',
    'function getActiveListings(uint256 offset, uint256 limit) public view returns (uint256[], address[], uint256[])',
    'event ItemSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price)'
  ];

  constructor(config: SDKConfig) {
    this.config = config;
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    
    if (config.privateKey) {
      this.wallet = new ethers.Wallet(config.privateKey, this.provider);
    }

    this.initializeContracts();
  }

  private initializeContracts() {
    const signer = this.wallet || this.provider;

    this.contracts.krwStablecoin = new ethers.Contract(
      this.config.contractAddresses.krwStablecoin,
      KRWGameSDK.KRWGC_ABI,
      signer
    );

    this.contracts.gameItemNFT = new ethers.Contract(
      this.config.contractAddresses.gameItemNFT,
      KRWGameSDK.NFT_ABI,
      signer
    );

    this.contracts.gameMarketplace = new ethers.Contract(
      this.config.contractAddresses.gameMarketplace,
      KRWGameSDK.MARKETPLACE_ABI,
      signer
    );
  }

  /**
   * Get player's KRW Game Credits balance
   */
  async getBalance(playerAddress: string): Promise<string> {
    try {
      const balance = await this.contracts.krwStablecoin!.balanceOf(playerAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      throw new Error(`Failed to get balance: ${error}`);
    }
  }

  /**
   * Mint a new game item for a player
   */
  async mintItem(playerAddress: string, item: GameItem): Promise<string> {
    try {
      if (!this.wallet) {
        throw new Error('Wallet required for minting');
      }

      const tx = await this.contracts.gameItemNFT!.mintGameItem(
        playerAddress,
        item.type,
        item.rarity,
        item.attack,
        item.defense,
        item.durability,
        this.config.gameId,
        item.metadataUri
      );

      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      throw new Error(`Failed to mint item: ${error}`);
    }
  }

  /**
   * Process in-game purchase with KRW stablecoin
   */
  async processPurchase(request: PurchaseRequest): Promise<PaymentResult> {
    try {
      if (!this.wallet) {
        throw new Error('Wallet required for processing purchases');
      }

      // In a real implementation, you would:
      // 1. Verify the payment amount
      // 2. Check item availability
      // 3. Process the marketplace transaction
      // 4. Handle any errors appropriately

      const tx = await this.contracts.gameMarketplace!.buyItem(request.itemId);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (error) {
      return {
        success: false,
        error: `Purchase failed: ${error}`
      };
    }
  }

  /**
   * Get all items owned by a player
   */
  async getPlayerItems(playerAddress: string): Promise<any[]> {
    try {
      const tokenIds = await this.contracts.gameItemNFT!.getItemsByOwner(playerAddress);
      const items = [];

      for (const tokenId of tokenIds) {
        const itemData = await this.contracts.gameItemNFT!.gameItems(tokenId);
        items.push({
          tokenId: tokenId.toString(),
          ...itemData
        });
      }

      return items;
    } catch (error) {
      throw new Error(`Failed to get player items: ${error}`);
    }
  }

  /**
   * Listen for purchase events
   */
  onPurchase(callback: (event: any) => void): void {
    this.contracts.gameMarketplace!.on('ItemSold', (tokenId, buyer, seller, price, event) => {
      callback({
        tokenId: tokenId.toString(),
        buyer,
        seller,
        price: ethers.formatEther(price),
        transactionHash: event.log.transactionHash
      });
    });
  }

  /**
   * Stop listening for events
   */
  removeAllListeners(): void {
    this.contracts.gameMarketplace!.removeAllListeners();
  }

  /**
   * Get marketplace statistics
   */
  async getMarketplaceStats(): Promise<{
    activeListings: number;
    totalVolume: string;
    averagePrice: string;
  }> {
    try {
      // In a real implementation, this would fetch actual marketplace data
      const [tokenIds] = await this.contracts.gameMarketplace!.getActiveListings(0, 100);
      
      return {
        activeListings: tokenIds.length,
        totalVolume: "2450000", // Mock data
        averagePrice: "12500"   // Mock data
      };
    } catch (error) {
      throw new Error(`Failed to get marketplace stats: ${error}`);
    }
  }

  /**
   * Create a payment widget for web integration
   */
  createPaymentWidget(containerId: string, options: {
    itemId: number;
    price: string;
    onSuccess?: (result: PaymentResult) => void;
    onError?: (error: string) => void;
  }): void {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id '${containerId}' not found`);
    }

    // Create payment widget HTML
    container.innerHTML = `
      <div class="krw-payment-widget" style="
        border: 2px solid #3B82F6;
        border-radius: 12px;
        padding: 20px;
        background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 400px;
        margin: 0 auto;
      ">
        <div style="text-align: center; margin-bottom: 16px;">
          <h3 style="margin: 0; color: #1F2937; font-size: 18px; font-weight: 600;">
            Purchase with KRW Game Credits
          </h3>
        </div>
        
        <div style="margin-bottom: 16px;">
          <div style="font-size: 14px; color: #6B7280; margin-bottom: 4px;">Price:</div>
          <div style="font-size: 24px; font-weight: bold; color: #1F2937;">
            ${parseInt(options.price).toLocaleString()} KRWGC
          </div>
        </div>

        <button 
          id="krw-pay-button-${options.itemId}"
          style="
            width: 100%;
            background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
          "
          onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 8px 25px rgba(59, 130, 246, 0.4)'"
          onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'"
        >
          Buy Now with KRWGC
        </button>
        
        <div style="margin-top: 12px; text-align: center; font-size: 12px; color: #6B7280;">
          Secure payment powered by blockchain
        </div>
      </div>
    `;

    // Add click handler
    const button = document.getElementById(`krw-pay-button-${options.itemId}`);
    button?.addEventListener('click', async () => {
      try {
        button.innerHTML = 'Processing...';
        button.style.opacity = '0.7';
        
        const result = await this.processPurchase({
          itemId: options.itemId,
          buyerAddress: '', // Would get from connected wallet
          paymentAmount: ethers.parseEther(options.price).toString()
        });

        if (result.success) {
          button.innerHTML = '✓ Purchase Complete!';
          button.style.background = '#10B981';
          options.onSuccess?.(result);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        button.innerHTML = 'Purchase Failed';
        button.style.background = '#EF4444';
        options.onError?.(error instanceof Error ? error.message : 'Unknown error');
        
        setTimeout(() => {
          button.innerHTML = 'Buy Now with KRWGC';
          button.style.background = 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)';
          button.style.opacity = '1';
        }, 3000);
      }
    });
  }
}

// Export types and SDK
export default KRWGameSDK;
