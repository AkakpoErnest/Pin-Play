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

  // Create some demo NFTs with real metadata
  console.log("\n🎯 Creating demo game items...");
  const demoItems = [
    { 
      type: "sword", 
      rarity: 5, 
      name: "Quantum Quasar Blade",
      uri: JSON.stringify({
        name: "Quantum Quasar Blade",
        description: "A legendary sword that cuts through dimensions with quantum energy.",
        image: "https://pin-play-7rl9.vercel.app/nft-items/quantum_quasar_card.png",
        attributes: [
          { trait_type: "Rarity", value: "Legendary" },
          { trait_type: "Attack", value: 160 },
          { trait_type: "Defense", value: 25 },
          { trait_type: "Game", value: "demo-rpg" }
        ]
      })
    },
    { 
      type: "armor", 
      rarity: 4, 
      name: "Vortex Vanguard Armor",
      uri: JSON.stringify({
        name: "Vortex Vanguard Armor",
        description: "Epic armor that channels the power of cosmic vortexes for ultimate protection.",
        image: "https://pin-play-7rl9.vercel.app/nft-items/vortex_vanguard_card.png",
        attributes: [
          { trait_type: "Rarity", value: "Epic" },
          { trait_type: "Attack", value: 40 },
          { trait_type: "Defense", value: 140 },
          { trait_type: "Game", value: "demo-rpg" }
        ]
      })
    },
    { 
      type: "shield", 
      rarity: 3, 
      name: "Pin Blazer Shield",
      uri: JSON.stringify({
        name: "Pin Blazer Shield",
        description: "A rare shield that blazes with protective energy and deflects even magical attacks.",
        image: "https://pin-play-7rl9.vercel.app/nft-items/pin_blazer_card.png",
        attributes: [
          { trait_type: "Rarity", value: "Rare" },
          { trait_type: "Attack", value: 15 },
          { trait_type: "Defense", value: 95 },
          { trait_type: "Game", value: "demo-rpg" }
        ]
      })
    },
    { 
      type: "potion", 
      rarity: 2, 
      name: "Aether Weaver Elixir",
      uri: JSON.stringify({
        name: "Aether Weaver Elixir",
        description: "An uncommon potion that weaves aether magic to restore health and mana.",
        image: "https://pin-play-7rl9.vercel.app/nft-items/aether_weaver_card.png",
        attributes: [
          { trait_type: "Rarity", value: "Uncommon" },
          { trait_type: "Attack", value: 0 },
          { trait_type: "Defense", value: 0 },
          { trait_type: "Healing", value: 150 },
          { trait_type: "Game", value: "demo-rpg" }
        ]
      })
    },
    { 
      type: "armor", 
      rarity: 4, 
      name: "Shadow Sentinel Plate",
      uri: JSON.stringify({
        name: "Shadow Sentinel Plate",
        description: "Epic armor forged from shadow essence, providing stealth and protection.",
        image: "https://pin-play-7rl9.vercel.app/nft-items/shadow_sentinel_card.png",
        attributes: [
          { trait_type: "Rarity", value: "Epic" },
          { trait_type: "Attack", value: 35 },
          { trait_type: "Defense", value: 135 },
          { trait_type: "Stealth", value: 50 },
          { trait_type: "Game", value: "demo-rpg" }
        ]
      })
    }
  ];

  for (let i = 0; i < demoItems.length; i++) {
    const item = demoItems[i];
    const metadata = JSON.parse(item.uri);
    const attack = metadata.attributes.find(attr => attr.trait_type === "Attack")?.value || (100 + (item.rarity * 20));
    const defense = metadata.attributes.find(attr => attr.trait_type === "Defense")?.value || (50 + (item.rarity * 15));
    
    await gameItemNFT.mintGameItem(
      deployer.address,
      item.type,
      item.rarity,
      attack,
      defense,
      100,                      // durability
      "demo-rpg",
      item.uri
    );
    console.log(`✅ Minted ${item.name} (${item.type}, rarity ${item.rarity}) NFT #${i}`);
  }

  // List some items on marketplace
  console.log("\n🏪 Listing demo items on marketplace...");
  
  // Approve marketplace to transfer NFTs
  await gameItemNFT.setApprovalForAll(marketplaceAddress, true);
  
  // List all items with rarity-based pricing
  const basePrices = {
    1: ethers.parseEther("500"),    // Common - 500 KRWGC
    2: ethers.parseEther("1500"),   // Uncommon - 1500 KRWGC  
    3: ethers.parseEther("4000"),   // Rare - 4000 KRWGC
    4: ethers.parseEther("10000"),  // Epic - 10000 KRWGC
    5: ethers.parseEther("25000"),  // Legendary - 25000 KRWGC
  };

  for (let i = 0; i < demoItems.length; i++) {
    const item = demoItems[i];
    const price = basePrices[item.rarity];
    await gameMarketplace.listItem(i, price);
    console.log(`✅ Listed ${item.name} (#${i}) for ${ethers.formatEther(price)} KRWGC`);
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
