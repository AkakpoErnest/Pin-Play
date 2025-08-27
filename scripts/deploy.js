const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying KRW Game Credits contracts...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

  // Deploy KRW Stablecoin
  console.log("\n📈 Deploying KRW Stablecoin...");
  const KRWStablecoin = await ethers.getContractFactory("KRWStablecoin");
  const krwStablecoin = await KRWStablecoin.deploy(
    deployer.address, // oracle address (using deployer for demo)
    ethers.parseEther("0.0007692") // initial peg rate (1 KRW = ~0.0007692 ETH, simplified)
  );
  await krwStablecoin.waitForDeployment();
  const krwAddress = await krwStablecoin.getAddress();
  console.log("✅ KRW Stablecoin deployed to:", krwAddress);

  // Deploy Game Item NFT
  console.log("\n🎮 Deploying Game Item NFT...");
  const GameItemNFT = await ethers.getContractFactory("GameItemNFT");
  const gameItemNFT = await GameItemNFT.deploy();
  await gameItemNFT.waitForDeployment();
  const nftAddress = await gameItemNFT.getAddress();
  console.log("✅ Game Item NFT deployed to:", nftAddress);

  // Deploy Game Marketplace
  console.log("\n🏪 Deploying Game Marketplace...");
  const GameMarketplace = await ethers.getContractFactory("GameMarketplace");
  const gameMarketplace = await GameMarketplace.deploy(
    krwAddress,
    nftAddress,
    deployer.address // fee recipient
  );
  await gameMarketplace.waitForDeployment();
  const marketplaceAddress = await gameMarketplace.getAddress();
  console.log("✅ Game Marketplace deployed to:", marketplaceAddress);

  // Setup contracts
  console.log("\n⚙️  Setting up contracts...");
  
  // Add marketplace as authorized minter for NFTs
  await gameItemNFT.addAuthorizedMinter(marketplaceAddress);
  console.log("✅ Marketplace authorized as NFT minter");

  // Authorize a demo game
  await gameItemNFT.authorizeGame("demo-rpg");
  console.log("✅ Demo RPG game authorized");

  // Register demo game developer in marketplace
  await gameMarketplace.registerGameDeveloper(
    "demo-rpg",
    deployer.address,
    2000 // 20% revenue share
  );
  console.log("✅ Demo game developer registered");

  // Mint some demo tokens to deployer
  console.log("\n🪙 Minting demo KRW tokens...");
  const demoAmount = ethers.parseEther("100000"); // 100k KRWGC
  await krwStablecoin.mint(deployer.address, demoAmount);
  console.log("✅ Minted 100,000 KRWGC to deployer");

  // Create some demo NFTs
  console.log("\n🎯 Creating demo game items...");
  const demoItems = [
    { type: "sword", rarity: 3, uri: "https://api.example.com/metadata/sword1.json" },
    { type: "shield", rarity: 2, uri: "https://api.example.com/metadata/shield1.json" },
    { type: "potion", rarity: 1, uri: "https://api.example.com/metadata/potion1.json" },
    { type: "armor", rarity: 4, uri: "https://api.example.com/metadata/armor1.json" },
  ];

  for (let i = 0; i < demoItems.length; i++) {
    const item = demoItems[i];
    await gameItemNFT.mintGameItem(
      deployer.address,
      item.type,
      item.rarity,
      100 + (item.rarity * 20), // attack
      50 + (item.rarity * 15),  // defense
      100,                      // durability
      "demo-rpg",
      item.uri
    );
    console.log(`✅ Minted ${item.type} (rarity ${item.rarity}) NFT #${i}`);
  }

  // List some items on marketplace
  console.log("\n🏪 Listing demo items on marketplace...");
  
  // Approve marketplace to transfer NFTs
  await gameItemNFT.setApprovalForAll(marketplaceAddress, true);
  
  // List first two items
  const prices = [
    ethers.parseEther("5000"),  // sword - 5000 KRWGC
    ethers.parseEther("3000"),  // shield - 3000 KRWGC
  ];

  for (let i = 0; i < 2; i++) {
    await gameMarketplace.listItem(i, prices[i]);
    console.log(`✅ Listed NFT #${i} for ${ethers.formatEther(prices[i])} KRWGC`);
  }

  // Summary
  console.log("\n🎉 Deployment Summary:");
  console.log("=====================");
  console.log("KRW Stablecoin:", krwAddress);
  console.log("Game Item NFT:", nftAddress);
  console.log("Game Marketplace:", marketplaceAddress);
  console.log("Deployer Address:", deployer.address);
  console.log("\n📋 Next Steps:");
  console.log("1. Update your .env file with the contract addresses");
  console.log("2. Run the frontend: npm run dev");
  console.log("3. Connect your wallet and start trading!");

  // Save addresses to a file for frontend
  const fs = require('fs');
  const addresses = {
    KRWStablecoin: krwAddress,
    GameItemNFT: nftAddress,
    GameMarketplace: marketplaceAddress,
    Deployer: deployer.address,
    Network: await deployer.provider.getNetwork().then(n => n.name),
    ChainId: await deployer.provider.getNetwork().then(n => n.chainId.toString())
  };

  fs.writeFileSync(
    './contract-addresses.json',
    JSON.stringify(addresses, null, 2)
  );
  console.log("\n💾 Contract addresses saved to contract-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
