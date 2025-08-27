#!/usr/bin/env node

/**
 * KRW Game Credits - Quick Wallet Setup Script
 * This script helps users quickly set up their MetaMask for the local network
 */

console.log(`
🎮 KRW Game Credits - Quick Setup Guide
=====================================

📋 STEP 1: Add Network to MetaMask
----------------------------------
Network Name: KRW Game Credits Local
RPC URL: http://localhost:8545  
Chain ID: 1337
Currency: ETH

📋 STEP 2: Import Test Account
------------------------------
Choose one of these accounts:

🟢 ACCOUNT #1 (Deployer - Has 100k KRWGC):
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

🔵 ACCOUNT #2 (Fresh User):
Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8  
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

📋 STEP 3: Available NFTs to Purchase
------------------------------------
🗡️  Quantum Quasar Blade (Legendary) - 25,000 KRWGC
🛡️  Vortex Vanguard Armor (Epic) - 10,000 KRWGC  
🛡️  Shadow Sentinel Plate (Epic) - 10,000 KRWGC
🛡️  Pin Blazer Shield (Rare) - 4,000 KRWGC
🧪 Aether Weaver Elixir (Uncommon) - 1,500 KRWGC

📋 STEP 4: Start Shopping!
--------------------------
1. Visit: https://pin-play-7rl9.vercel.app
2. Connect your wallet
3. Go to Wallet → Mint Test Tokens (get 10k KRWGC)
4. Visit Marketplace → Buy NFTs!

🎉 Happy Gaming! 🎮
`);

module.exports = {
  networkConfig: {
    name: "KRW Game Credits Local",
    rpcUrl: "http://localhost:8545",
    chainId: 1337,
    currency: "ETH"
  },
  contracts: {
    KRWStablecoin: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    GameItemNFT: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", 
    GameMarketplace: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  },
  testAccounts: [
    {
      name: "Deployer (Has 100k KRWGC)",
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    },
    {
      name: "Fresh User", 
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    }
  ]
};
