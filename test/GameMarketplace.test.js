const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GameMarketplace", function () {
  let krwStablecoin, gameItemNFT, gameMarketplace;
  let owner, buyer, seller, oracle;

  beforeEach(async function () {
    [owner, buyer, seller, oracle] = await ethers.getSigners();

    // Deploy KRW Stablecoin
    const KRWStablecoin = await ethers.getContractFactory("KRWStablecoin");
    krwStablecoin = await KRWStablecoin.deploy(
      oracle.address,
      ethers.parseEther("0.0007692")
    );

    // Deploy Game Item NFT
    const GameItemNFT = await ethers.getContractFactory("GameItemNFT");
    gameItemNFT = await GameItemNFT.deploy();

    // Deploy Game Marketplace
    const GameMarketplace = await ethers.getContractFactory("GameMarketplace");
    gameMarketplace = await GameMarketplace.deploy(
      await krwStablecoin.getAddress(),
      await gameItemNFT.getAddress(),
      owner.address
    );

    // Setup
    await gameItemNFT.addAuthorizedMinter(await gameMarketplace.getAddress());
    await gameItemNFT.authorizeGame("test-game");
    
    // Mint some tokens for testing
    await krwStablecoin.mint(buyer.address, ethers.parseEther("100000"));
    await krwStablecoin.mint(seller.address, ethers.parseEther("100000"));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await gameMarketplace.owner()).to.equal(owner.address);
    });

    it("Should set the correct token addresses", async function () {
      expect(await gameMarketplace.krwToken()).to.equal(await krwStablecoin.getAddress());
      expect(await gameMarketplace.gameNFT()).to.equal(await gameItemNFT.getAddress());
    });
  });

  describe("Listing and Purchasing", function () {
    beforeEach(async function () {
      // Mint an NFT to seller
      await gameItemNFT.connect(owner).mintGameItem(
        seller.address,
        "sword",
        3,
        100,
        50,
        100,
        "test-game",
        "https://example.com/metadata.json"
      );
    });

    it("Should allow listing an item", async function () {
      const tokenId = 0;
      const price = ethers.parseEther("5000");

      await gameItemNFT.connect(seller).approve(await gameMarketplace.getAddress(), tokenId);
      await gameMarketplace.connect(seller).listItem(tokenId, price);

      const listing = await gameMarketplace.listings(tokenId);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(price);
      expect(listing.active).to.be.true;
    });

    it("Should allow purchasing a listed item", async function () {
      const tokenId = 0;
      const price = ethers.parseEther("5000");

      // List the item
      await gameItemNFT.connect(seller).approve(await gameMarketplace.getAddress(), tokenId);
      await gameMarketplace.connect(seller).listItem(tokenId, price);

      // Approve marketplace to spend buyer's tokens
      await krwStablecoin.connect(buyer).approve(await gameMarketplace.getAddress(), price);

      // Purchase the item
      await gameMarketplace.connect(buyer).buyItem(tokenId);

      // Check ownership transferred
      expect(await gameItemNFT.ownerOf(tokenId)).to.equal(buyer.address);
      
      // Check listing is no longer active
      const listing = await gameMarketplace.listings(tokenId);
      expect(listing.active).to.be.false;
    });
  });
});
