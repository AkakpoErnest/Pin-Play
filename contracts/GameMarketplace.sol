// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./KRWStablecoin.sol";
import "./GameItemNFT.sol";

/**
 * @title GameMarketplace
 * @dev Marketplace for trading game items using KRW stablecoin
 * Features:
 * - Direct purchases with KRW stablecoin
 * - Auction functionality
 * - Fee management and royalty distribution
 * - Game developer revenue sharing
 * - Bulk purchase support
 */
contract GameMarketplace is ReentrancyGuard, Pausable, Ownable, IERC721Receiver {
    // Events
    event ItemListed(uint256 indexed tokenId, address indexed seller, uint256 price, uint256 timestamp);
    event ItemSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);
    event ItemDelisted(uint256 indexed tokenId, address indexed seller);
    event AuctionCreated(uint256 indexed tokenId, address indexed seller, uint256 startPrice, uint256 endTime);
    event BidPlaced(uint256 indexed tokenId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed tokenId, address indexed winner, uint256 finalPrice);
    event FeesCollected(address indexed recipient, uint256 amount);
    event GameDeveloperPaid(string indexed game, address indexed developer, uint256 amount);

    // Structs
    struct Listing {
        address seller;
        uint256 price;
        uint256 timestamp;
        bool active;
    }

    struct Auction {
        address seller;
        uint256 startPrice;
        uint256 currentBid;
        address highestBidder;
        uint256 endTime;
        bool active;
    }

    struct GameDeveloper {
        address payable wallet;
        uint256 revenueShare; // Percentage in basis points (100 = 1%)
        bool isActive;
    }

    // State variables
    KRWStablecoin public immutable krwToken;
    GameItemNFT public immutable gameNFT;
    
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Auction) public auctions;
    mapping(string => GameDeveloper) public gameDevelopers;
    mapping(address => uint256) public pendingWithdrawals;
    
    uint256 public marketplaceFee = 250; // 2.5% in basis points
    uint256 public constant MAX_FEE = 1000; // 10% maximum fee
    address public feeRecipient;
    
    // Statistics
    uint256 public totalVolume;
    uint256 public totalTransactions;
    mapping(string => uint256) public gameVolume;

    modifier validTokenId(uint256 tokenId) {
        require(gameNFT.ownerOf(tokenId) != address(0), "GameMarketplace: token does not exist");
        _;
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        require(gameNFT.ownerOf(tokenId) == msg.sender, "GameMarketplace: not token owner");
        _;
    }

    constructor(
        address _krwToken,
        address _gameNFT,
        address _feeRecipient
    ) Ownable(msg.sender) {
        require(_krwToken != address(0), "GameMarketplace: KRW token cannot be zero address");
        require(_gameNFT != address(0), "GameMarketplace: Game NFT cannot be zero address");
        require(_feeRecipient != address(0), "GameMarketplace: fee recipient cannot be zero address");
        
        krwToken = KRWStablecoin(_krwToken);
        gameNFT = GameItemNFT(_gameNFT);
        feeRecipient = _feeRecipient;
    }

    /**
     * @dev Lists an item for sale
     * @param tokenId The ID of the token to list
     * @param price The price in KRW stablecoin
     */
    function listItem(uint256 tokenId, uint256 price) 
        external 
        validTokenId(tokenId) 
        onlyTokenOwner(tokenId) 
        whenNotPaused 
    {
        require(price > 0, "GameMarketplace: price must be greater than 0");
        require(!listings[tokenId].active, "GameMarketplace: item already listed");
        require(!auctions[tokenId].active, "GameMarketplace: item is in auction");
        
        // Transfer NFT to marketplace for escrow
        gameNFT.safeTransferFrom(msg.sender, address(this), tokenId);
        
        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            timestamp: block.timestamp,
            active: true
        });
        
        emit ItemListed(tokenId, msg.sender, price, block.timestamp);
    }

    /**
     * @dev Removes an item from sale
     * @param tokenId The ID of the token to delist
     */
    function delistItem(uint256 tokenId) 
        external 
        validTokenId(tokenId) 
        whenNotPaused 
    {
        Listing storage listing = listings[tokenId];
        require(listing.active, "GameMarketplace: item not listed");
        require(listing.seller == msg.sender, "GameMarketplace: not the seller");
        
        listing.active = false;
        
        // Return NFT to seller
        gameNFT.safeTransferFrom(address(this), msg.sender, tokenId);
        
        emit ItemDelisted(tokenId, msg.sender);
    }

    /**
     * @dev Purchases a listed item
     * @param tokenId The ID of the token to purchase
     */
    function buyItem(uint256 tokenId) 
        external 
        validTokenId(tokenId) 
        nonReentrant 
        whenNotPaused 
    {
        Listing storage listing = listings[tokenId];
        require(listing.active, "GameMarketplace: item not for sale");
        require(msg.sender != listing.seller, "GameMarketplace: cannot buy your own item");
        
        uint256 price = listing.price;
        address seller = listing.seller;
        
        // Deactivate listing
        listing.active = false;
        
        // Process payment
        _processPayment(tokenId, msg.sender, seller, price);
        
        // Transfer NFT to buyer
        gameNFT.safeTransferFrom(address(this), msg.sender, tokenId);
        
        emit ItemSold(tokenId, msg.sender, seller, price);
    }

    /**
     * @dev Batch purchase multiple items
     * @param tokenIds Array of token IDs to purchase
     */
    function buyItems(uint256[] calldata tokenIds) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(tokenIds.length > 0 && tokenIds.length <= 20, "GameMarketplace: invalid batch size");
        
        uint256 totalCost = 0;
        
        // Calculate total cost first
        for (uint256 i = 0; i < tokenIds.length; i++) {
            Listing storage listing = listings[tokenIds[i]];
            require(listing.active, "GameMarketplace: item not for sale");
            require(msg.sender != listing.seller, "GameMarketplace: cannot buy your own item");
            totalCost += listing.price;
        }
        
        // Check buyer has enough balance
        require(
            krwToken.balanceOf(msg.sender) >= totalCost,
            "GameMarketplace: insufficient balance"
        );
        
        // Process each purchase
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            Listing storage listing = listings[tokenId];
            
            address seller = listing.seller;
            uint256 price = listing.price;
            
            // Deactivate listing
            listing.active = false;
            
            // Process payment
            _processPayment(tokenId, msg.sender, seller, price);
            
            // Transfer NFT to buyer
            gameNFT.safeTransferFrom(address(this), msg.sender, tokenId);
            
            emit ItemSold(tokenId, msg.sender, seller, price);
        }
    }

    /**
     * @dev Creates an auction for an item
     * @param tokenId The ID of the token to auction
     * @param startPrice The starting price for the auction
     * @param duration The duration of the auction in seconds
     */
    function createAuction(
        uint256 tokenId, 
        uint256 startPrice, 
        uint256 duration
    ) 
        external 
        validTokenId(tokenId) 
        onlyTokenOwner(tokenId) 
        whenNotPaused 
    {
        require(startPrice > 0, "GameMarketplace: start price must be greater than 0");
        require(duration >= 1 hours && duration <= 7 days, "GameMarketplace: invalid duration");
        require(!listings[tokenId].active, "GameMarketplace: item is listed for sale");
        require(!auctions[tokenId].active, "GameMarketplace: auction already exists");
        
        // Transfer NFT to marketplace for escrow
        gameNFT.safeTransferFrom(msg.sender, address(this), tokenId);
        
        uint256 endTime = block.timestamp + duration;
        
        auctions[tokenId] = Auction({
            seller: msg.sender,
            startPrice: startPrice,
            currentBid: 0,
            highestBidder: address(0),
            endTime: endTime,
            active: true
        });
        
        emit AuctionCreated(tokenId, msg.sender, startPrice, endTime);
    }

    /**
     * @dev Places a bid on an auction
     * @param tokenId The ID of the token to bid on
     * @param bidAmount The amount to bid
     */
    function placeBid(uint256 tokenId, uint256 bidAmount) 
        external 
        validTokenId(tokenId) 
        nonReentrant 
        whenNotPaused 
    {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "GameMarketplace: auction not active");
        require(block.timestamp < auction.endTime, "GameMarketplace: auction ended");
        require(msg.sender != auction.seller, "GameMarketplace: cannot bid on your own auction");
        require(bidAmount >= auction.startPrice, "GameMarketplace: bid below start price");
        require(bidAmount > auction.currentBid, "GameMarketplace: bid too low");
        
        // Return previous bid to previous bidder
        if (auction.highestBidder != address(0)) {
            pendingWithdrawals[auction.highestBidder] += auction.currentBid;
        }
        
        // Transfer new bid from bidder
        require(
            krwToken.transferFrom(msg.sender, address(this), bidAmount),
            "GameMarketplace: bid transfer failed"
        );
        
        auction.currentBid = bidAmount;
        auction.highestBidder = msg.sender;
        
        emit BidPlaced(tokenId, msg.sender, bidAmount);
    }

    /**
     * @dev Ends an auction and transfers the item
     * @param tokenId The ID of the token auction to end
     */
    function endAuction(uint256 tokenId) 
        external 
        validTokenId(tokenId) 
        nonReentrant 
        whenNotPaused 
    {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "GameMarketplace: auction not active");
        require(block.timestamp >= auction.endTime, "GameMarketplace: auction not ended");
        
        auction.active = false;
        
        if (auction.highestBidder != address(0)) {
            // Auction successful
            _processPayment(tokenId, auction.highestBidder, auction.seller, auction.currentBid);
            gameNFT.safeTransferFrom(address(this), auction.highestBidder, tokenId);
            
            emit AuctionEnded(tokenId, auction.highestBidder, auction.currentBid);
            emit ItemSold(tokenId, auction.highestBidder, auction.seller, auction.currentBid);
        } else {
            // No bids, return to seller
            gameNFT.safeTransferFrom(address(this), auction.seller, tokenId);
            emit AuctionEnded(tokenId, address(0), 0);
        }
    }

    /**
     * @dev Processes payment distribution
     */
    function _processPayment(
        uint256 tokenId, 
        address buyer, 
        address seller, 
        uint256 price
    ) internal {
        // Transfer payment from buyer
        require(
            krwToken.transferFrom(buyer, address(this), price),
            "GameMarketplace: payment transfer failed"
        );
        
        // Calculate fees
        uint256 marketplaceFeeAmount = (price * marketplaceFee) / 10000;
        uint256 sellerAmount = price - marketplaceFeeAmount;
        
        // Get game info for revenue sharing
        (,,,,, string memory game,,) = gameNFT.gameItems(tokenId);
        GameDeveloper storage developer = gameDevelopers[game];
        
        if (developer.isActive && developer.revenueShare > 0) {
            uint256 devShare = (marketplaceFeeAmount * developer.revenueShare) / 10000;
            uint256 marketplaceShare = marketplaceFeeAmount - devShare;
            
            // Pay game developer
            require(krwToken.transfer(developer.wallet, devShare), "GameMarketplace: dev payment failed");
            emit GameDeveloperPaid(game, developer.wallet, devShare);
            
            // Pay marketplace fee
            pendingWithdrawals[feeRecipient] += marketplaceShare;
        } else {
            // Pay full marketplace fee
            pendingWithdrawals[feeRecipient] += marketplaceFeeAmount;
        }
        
        // Pay seller
        require(krwToken.transfer(seller, sellerAmount), "GameMarketplace: seller payment failed");
        
        // Update statistics
        totalVolume += price;
        totalTransactions++;
        gameVolume[game] += price;
    }

    /**
     * @dev Withdraws pending payments
     */
    function withdraw() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "GameMarketplace: no pending withdrawals");
        
        pendingWithdrawals[msg.sender] = 0;
        require(krwToken.transfer(msg.sender, amount), "GameMarketplace: withdrawal failed");
    }

    /**
     * @dev Registers a game developer for revenue sharing
     */
    function registerGameDeveloper(
        string memory game,
        address payable wallet,
        uint256 revenueShare
    ) external onlyOwner {
        require(wallet != address(0), "GameMarketplace: wallet cannot be zero address");
        require(revenueShare <= 5000, "GameMarketplace: revenue share cannot exceed 50%");
        
        gameDevelopers[game] = GameDeveloper({
            wallet: wallet,
            revenueShare: revenueShare,
            isActive: true
        });
    }

    /**
     * @dev Updates marketplace fee
     */
    function updateMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= MAX_FEE, "GameMarketplace: fee exceeds maximum");
        marketplaceFee = newFee;
    }

    /**
     * @dev Updates fee recipient
     */
    function updateFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "GameMarketplace: recipient cannot be zero address");
        feeRecipient = newRecipient;
    }

    /**
     * @dev Gets active listings
     */
    function getActiveListings(uint256 offset, uint256 limit) 
        external 
        view 
        returns (
            uint256[] memory tokenIds,
            address[] memory sellers,
            uint256[] memory prices
        ) 
    {
        // This is a simplified version - in production, you'd want to maintain an array of active listings
        uint256 totalSupply = gameNFT.totalSupply();
        uint256 count = 0;
        
        // Count active listings first
        for (uint256 i = offset; i < totalSupply && count < limit; i++) {
            if (listings[i].active) {
                count++;
            }
        }
        
        tokenIds = new uint256[](count);
        sellers = new address[](count);
        prices = new uint256[](count);
        
        uint256 index = 0;
        for (uint256 i = offset; i < totalSupply && index < count; i++) {
            if (listings[i].active) {
                tokenIds[index] = i;
                sellers[index] = listings[i].seller;
                prices[index] = listings[i].price;
                index++;
            }
        }
    }

    /**
     * @dev Pauses the marketplace
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the marketplace
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency function to return NFTs to their sellers
     */
    function emergencyReturnNFT(uint256 tokenId) external onlyOwner {
        require(gameNFT.ownerOf(tokenId) == address(this), "GameMarketplace: NFT not in marketplace");
        
        address returnTo;
        if (listings[tokenId].active) {
            returnTo = listings[tokenId].seller;
            listings[tokenId].active = false;
        } else if (auctions[tokenId].active) {
            returnTo = auctions[tokenId].seller;
            auctions[tokenId].active = false;
        }
        
        require(returnTo != address(0), "GameMarketplace: no valid owner found");
        gameNFT.safeTransferFrom(address(this), returnTo, tokenId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
