#!/usr/bin/env node

/**
 * Test script to verify marketplace functionality
 */

const { ethers } = require('ethers');

const MARKETPLACE_ABI = [
  'function getActiveListings(uint256 offset, uint256 limit) view returns (uint256[] tokenIds, address[] sellers, uint256[] prices)',
];

const NFT_ABI = [
  'function gameItems(uint256 tokenId) public view returns (tuple(string itemType, uint256 rarity, uint256 attack, uint256 defense, uint256 durability, string game, uint256 mintTimestamp, bool isTransferable))'
];

const CONTRACT_ADDRESSES = {
  GameMarketplace: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  GameItemNFT: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
};

async function testMarketplace() {
  try {
    console.log('🔍 Testing marketplace connection...');
    
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    const marketplace = new ethers.Contract(CONTRACT_ADDRESSES.GameMarketplace, MARKETPLACE_ABI, provider);
    const nft = new ethers.Contract(CONTRACT_ADDRESSES.GameItemNFT, NFT_ABI, provider);
    
    console.log('📊 Fetching active listings...');
    const result = await marketplace.getActiveListings(0, 50);
    const [tokenIds, sellers, prices] = result;
    console.log(`Found ${tokenIds.length} listings`);
    
    for (let i = 0; i < tokenIds.length; i++) {
      const tokenId = tokenIds[i];
      const seller = sellers[i];
      const price = prices[i];
      
      console.log(`\n🎮 NFT #${i}:`);
      console.log(`  Token ID: ${tokenId}`);
      console.log(`  Seller: ${seller}`);
      console.log(`  Price: ${ethers.formatEther(price)} KRWGC`);
      
      try {
        const gameItem = await nft.gameItems(tokenId);
        console.log(`  Type: ${gameItem.itemType}`);
        console.log(`  Rarity: ${gameItem.rarity}`);
        console.log(`  Attack: ${gameItem.attack}`);
        console.log(`  Defense: ${gameItem.defense}`);
      } catch (error) {
        console.log(`  Error fetching item details: ${error.message}`);
      }
    }
    
    console.log('\n✅ Marketplace test completed!');
    
  } catch (error) {
    console.error('❌ Marketplace test failed:', error.message);
    process.exit(1);
  }
}

testMarketplace();
