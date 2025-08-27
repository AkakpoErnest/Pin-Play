// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
/**
 * @title GameItemNFT
 * @dev NFT contract for game items that can be purchased with KRW stablecoin
 * Features:
 * - ERC721 compliant with metadata storage
 * - Burnable tokens
 * - Pausable for emergency situations
 * - Royalty support for creators
 * - Gaming-specific metadata
 */
contract GameItemNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable, Pausable {
    // Events
    event ItemMinted(uint256 indexed tokenId, address indexed to, string itemType, uint256 rarity);
    event ItemTypeAdded(string itemType, uint256 basePrice, uint256 maxSupply);
    event RoyaltyUpdated(address indexed recipient, uint256 percentage);

    // Token ID counter
    uint256 private _tokenIdCounter;

    // Item metadata structure
    struct GameItem {
        string itemType;        // e.g., "weapon", "armor", "consumable"
        uint256 rarity;         // 1-5 (common to legendary)
        uint256 attack;         // Attack power
        uint256 defense;        // Defense power
        uint256 durability;     // Item durability
        string game;            // Game identifier
        uint256 mintTimestamp;  // When the item was minted
        bool isTransferable;    // Whether the item can be transferred
    }

    // Item type configuration
    struct ItemType {
        uint256 basePrice;      // Base price in KRW stablecoin
        uint256 maxSupply;      // Maximum supply for this item type
        uint256 currentSupply;  // Current supply
        bool isActive;          // Whether this item type is active
    }

    // State variables
    mapping(uint256 => GameItem) public gameItems;
    mapping(string => ItemType) public itemTypes;
    mapping(address => bool) public authorizedMinters;
    
    // Royalty info
    address public royaltyRecipient;
    uint256 public royaltyPercentage = 250; // 2.5% in basis points

    // Game integration
    mapping(string => bool) public authorizedGames;
    mapping(address => string) public gameOperators;

    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "GameItemNFT: not authorized to mint");
        _;
    }

    modifier onlyAuthorizedGame(string memory game) {
        require(authorizedGames[game], "GameItemNFT: game not authorized");
        _;
    }

    constructor() ERC721("KRW Game Items", "KRWGI") Ownable(msg.sender) {
        royaltyRecipient = msg.sender;
        authorizedMinters[msg.sender] = true;
        
        // Add some default item types for demo
        _addItemType("sword", 5000 * 10**18, 1000); // 5000 KRWGC, max 1000
        _addItemType("shield", 3000 * 10**18, 1500);
        _addItemType("potion", 500 * 10**18, 10000);
        _addItemType("armor", 8000 * 10**18, 500);
        _addItemType("bow", 4500 * 10**18, 800);
    }

    /**
     * @dev Mints a new game item NFT
     * @param to The address to mint the NFT to
     * @param itemType The type of item to mint
     * @param rarity The rarity level (1-5)
     * @param attack Attack power
     * @param defense Defense power
     * @param durability Item durability
     * @param game Game identifier
     * @param uri The metadata URI for the token
     */
    function mintGameItem(
        address to,
        string memory itemType,
        uint256 rarity,
        uint256 attack,
        uint256 defense,
        uint256 durability,
        string memory game,
        string memory uri
    ) public onlyAuthorizedMinter onlyAuthorizedGame(game) whenNotPaused returns (uint256) {
        require(to != address(0), "GameItemNFT: mint to zero address");
        require(bytes(itemType).length > 0, "GameItemNFT: item type cannot be empty");
        require(rarity >= 1 && rarity <= 5, "GameItemNFT: rarity must be between 1 and 5");
        require(itemTypes[itemType].isActive, "GameItemNFT: item type not active");
        require(
            itemTypes[itemType].currentSupply < itemTypes[itemType].maxSupply,
            "GameItemNFT: max supply reached for this item type"
        );

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        // Create game item metadata
        gameItems[tokenId] = GameItem({
            itemType: itemType,
            rarity: rarity,
            attack: attack,
            defense: defense,
            durability: durability,
            game: game,
            mintTimestamp: block.timestamp,
            isTransferable: true
        });

        // Update supply
        itemTypes[itemType].currentSupply++;

        // Mint the NFT
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit ItemMinted(tokenId, to, itemType, rarity);
        return tokenId;
    }

    /**
     * @dev Batch mint multiple items (gas efficient)
     */
    function batchMintGameItems(
        address to,
        string[] memory itemTypeList,
        uint256[] memory rarityList,
        string memory game,
        string[] memory tokenURIs
    ) external onlyAuthorizedMinter onlyAuthorizedGame(game) whenNotPaused {
        require(
            itemTypeList.length == rarityList.length && 
            rarityList.length == tokenURIs.length,
            "GameItemNFT: arrays length mismatch"
        );
        require(itemTypeList.length <= 20, "GameItemNFT: batch size too large");

        for (uint256 i = 0; i < itemTypeList.length; i++) {
            mintGameItem(
                to,
                itemTypeList[i],
                rarityList[i],
                0, // Default stats for batch mint
                0,
                100,
                game,
                tokenURIs[i]
            );
        }
    }

    /**
     * @dev Updates item stats (for game mechanics)
     */
    function updateItemStats(
        uint256 tokenId,
        uint256 newAttack,
        uint256 newDefense,
        uint256 newDurability
    ) external {
        require(_ownerOf(tokenId) != address(0), "GameItemNFT: token does not exist");
        require(
            msg.sender == ownerOf(tokenId) || 
            authorizedMinters[msg.sender] || 
            msg.sender == owner(),
            "GameItemNFT: not authorized to update stats"
        );

        GameItem storage item = gameItems[tokenId];
        item.attack = newAttack;
        item.defense = newDefense;
        item.durability = newDurability;
    }

    /**
     * @dev Adds a new item type
     */
    function addItemType(
        string memory itemType,
        uint256 basePrice,
        uint256 maxSupply
    ) external onlyOwner {
        _addItemType(itemType, basePrice, maxSupply);
    }

    function _addItemType(
        string memory itemType,
        uint256 basePrice,
        uint256 maxSupply
    ) internal {
        require(bytes(itemType).length > 0, "GameItemNFT: item type cannot be empty");
        require(basePrice > 0, "GameItemNFT: base price must be greater than 0");
        require(maxSupply > 0, "GameItemNFT: max supply must be greater than 0");

        itemTypes[itemType] = ItemType({
            basePrice: basePrice,
            maxSupply: maxSupply,
            currentSupply: 0,
            isActive: true
        });

        emit ItemTypeAdded(itemType, basePrice, maxSupply);
    }

    /**
     * @dev Authorizes a new minter
     */
    function addAuthorizedMinter(address minter) external onlyOwner {
        require(minter != address(0), "GameItemNFT: minter cannot be zero address");
        authorizedMinters[minter] = true;
    }

    /**
     * @dev Removes an authorized minter
     */
    function removeAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
    }

    /**
     * @dev Authorizes a game to mint items
     */
    function authorizeGame(string memory game) external onlyOwner {
        require(bytes(game).length > 0, "GameItemNFT: game identifier cannot be empty");
        authorizedGames[game] = true;
    }

    /**
     * @dev Deauthorizes a game
     */
    function deauthorizeGame(string memory game) external onlyOwner {
        authorizedGames[game] = false;
    }

    /**
     * @dev Updates royalty information
     */
    function updateRoyalty(address recipient, uint256 percentage) external onlyOwner {
        require(recipient != address(0), "GameItemNFT: recipient cannot be zero address");
        require(percentage <= 1000, "GameItemNFT: royalty percentage cannot exceed 10%");
        
        royaltyRecipient = recipient;
        royaltyPercentage = percentage;
        emit RoyaltyUpdated(recipient, percentage);
    }

    /**
     * @dev Locks an item from being transferred (for game mechanics)
     */
    function lockItem(uint256 tokenId) external {
        require(_ownerOf(tokenId) != address(0), "GameItemNFT: token does not exist");
        require(
            msg.sender == ownerOf(tokenId) || 
            authorizedMinters[msg.sender] || 
            msg.sender == owner(),
            "GameItemNFT: not authorized to lock item"
        );
        
        gameItems[tokenId].isTransferable = false;
    }

    /**
     * @dev Unlocks an item for transfer
     */
    function unlockItem(uint256 tokenId) external {
        require(_ownerOf(tokenId) != address(0), "GameItemNFT: token does not exist");
        require(
            msg.sender == ownerOf(tokenId) || 
            authorizedMinters[msg.sender] || 
            msg.sender == owner(),
            "GameItemNFT: not authorized to unlock item"
        );
        
        gameItems[tokenId].isTransferable = true;
    }

    /**
     * @dev Gets item price with rarity multiplier
     */
    function getItemPrice(string memory itemType, uint256 rarity) external view returns (uint256) {
        require(itemTypes[itemType].isActive, "GameItemNFT: item type not active");
        require(rarity >= 1 && rarity <= 5, "GameItemNFT: invalid rarity");
        
        uint256 basePrice = itemTypes[itemType].basePrice;
        uint256 multiplier;
        
        if (rarity == 1) multiplier = 100;      // Common: 1x
        else if (rarity == 2) multiplier = 150; // Uncommon: 1.5x
        else if (rarity == 3) multiplier = 250; // Rare: 2.5x
        else if (rarity == 4) multiplier = 500; // Epic: 5x
        else multiplier = 1000;                 // Legendary: 10x
        
        return (basePrice * multiplier) / 100;
    }

    /**
     * @dev Returns the total number of tokens minted
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Gets all items owned by an address
     */
    function getItemsByOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory items = new uint256[](balance);
        uint256 counter = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (_ownerOf(i) != address(0) && ownerOf(i) == owner) {
                items[counter] = i;
                counter++;
            }
        }
        
        return items;
    }

    /**
     * @dev Pauses the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // Override functions
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override whenNotPaused returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) { // Not minting or burning
            require(gameItems[tokenId].isTransferable, "GameItemNFT: item is locked");
        }
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
