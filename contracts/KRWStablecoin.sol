// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title KRWStablecoin
 * @dev A KRW-pegged stablecoin for gaming and NFT transactions
 * Features:
 * - ERC20 compliant with permit functionality
 * - Mintable and burnable by authorized minters
 * - Pausable for emergency situations
 * - Oracle-based price feeds for stability
 * - Gaming-optimized gas efficiency
 */
contract KRWStablecoin is ERC20, ERC20Permit, Ownable, Pausable, ReentrancyGuard {
    // Events
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event OracleUpdated(address indexed newOracle);
    event PegAdjustment(uint256 newRate, uint256 timestamp);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    // State variables
    mapping(address => bool) public minters;
    address public oracle;
    uint256 public pegRate; // Rate in wei (1 KRW = pegRate wei)
    uint256 public lastPegUpdate;
    uint256 public constant PEG_UPDATE_COOLDOWN = 1 hours;
    
    // Stability mechanism
    uint256 public collateralRatio = 150; // 150% collateralization
    uint256 public stabilityFee = 50; // 0.5% fee in basis points
    
    modifier onlyMinter() {
        require(minters[msg.sender], "KRWStablecoin: caller is not a minter");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracle, "KRWStablecoin: caller is not the oracle");
        _;
    }

    constructor(
        address _oracle,
        uint256 _initialPegRate
    ) ERC20("KRW Game Credits", "KRWGC") ERC20Permit("KRW Game Credits") Ownable(msg.sender) {
        oracle = _oracle;
        pegRate = _initialPegRate;
        lastPegUpdate = block.timestamp;
        minters[msg.sender] = true;
        
        // Mint initial supply for testing (10M KRWGC)
        _mint(msg.sender, 10_000_000 * 10**decimals());
    }

    /**
     * @dev Mints new tokens to specified address
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyMinter whenNotPaused {
        require(to != address(0), "KRWStablecoin: mint to zero address");
        require(amount > 0, "KRWStablecoin: mint amount must be greater than 0");
        _mint(to, amount);
    }

    /**
     * @dev Burns tokens from caller's balance
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) external whenNotPaused {
        require(amount > 0, "KRWStablecoin: burn amount must be greater than 0");
        _burn(msg.sender, amount);
    }

    /**
     * @dev Burns tokens from specified address (requires allowance)
     * @param from The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) external whenNotPaused {
        require(amount > 0, "KRWStablecoin: burn amount must be greater than 0");
        uint256 currentAllowance = allowance(from, msg.sender);
        require(currentAllowance >= amount, "KRWStablecoin: burn amount exceeds allowance");
        
        _approve(from, msg.sender, currentAllowance - amount);
        _burn(from, amount);
    }

    /**
     * @dev Updates the peg rate (can only be called by oracle)
     * @param newRate The new peg rate
     */
    function updatePegRate(uint256 newRate) external onlyOracle {
        require(
            block.timestamp >= lastPegUpdate + PEG_UPDATE_COOLDOWN,
            "KRWStablecoin: peg update cooldown not passed"
        );
        require(newRate > 0, "KRWStablecoin: peg rate must be greater than 0");
        
        pegRate = newRate;
        lastPegUpdate = block.timestamp;
        emit PegAdjustment(newRate, block.timestamp);
    }

    /**
     * @dev Adds a new minter
     * @param minter The address to add as minter
     */
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "KRWStablecoin: minter cannot be zero address");
        require(!minters[minter], "KRWStablecoin: address is already a minter");
        
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    /**
     * @dev Removes a minter
     * @param minter The address to remove from minters
     */
    function removeMinter(address minter) external onlyOwner {
        require(minters[minter], "KRWStablecoin: address is not a minter");
        
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    /**
     * @dev Updates the oracle address
     * @param newOracle The new oracle address
     */
    function updateOracle(address newOracle) external onlyOwner {
        require(newOracle != address(0), "KRWStablecoin: oracle cannot be zero address");
        oracle = newOracle;
        emit OracleUpdated(newOracle);
    }

    /**
     * @dev Updates collateral ratio
     * @param newRatio The new collateral ratio (in percentage)
     */
    function updateCollateralRatio(uint256 newRatio) external onlyOwner {
        require(newRatio >= 100, "KRWStablecoin: collateral ratio must be at least 100%");
        collateralRatio = newRatio;
    }

    /**
     * @dev Updates stability fee
     * @param newFee The new stability fee (in basis points)
     */
    function updateStabilityFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "KRWStablecoin: stability fee cannot exceed 10%");
        stabilityFee = newFee;
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

    /**
     * @dev Emergency withdraw function for stuck tokens
     * @param token The token address to withdraw (address(0) for ETH)
     * @param amount The amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).transfer(owner(), amount);
        }
        emit EmergencyWithdraw(token, amount);
    }

    /**
     * @dev Gets the current USD value of KRW (for display purposes)
     * @param krwAmount The amount in KRW to convert
     * @return The equivalent value in USD (with 18 decimals)
     */
    function getUSDValue(uint256 krwAmount) external view returns (uint256) {
        // Simplified conversion: 1 USD ≈ 1300 KRW
        return (krwAmount * 1e18) / 1300;
    }

    /**
     * @dev Gets the current KRW value from USD
     * @param usdAmount The amount in USD to convert (with 18 decimals)
     * @return The equivalent value in KRW
     */
    function getKRWValue(uint256 usdAmount) external view returns (uint256) {
        // Simplified conversion: 1 USD ≈ 1300 KRW
        return (usdAmount * 1300) / 1e18;
    }

    /**
     * @dev Returns current peg information
     */
    function getPegInfo() external view returns (
        uint256 currentRate,
        uint256 lastUpdate,
        uint256 nextUpdateAvailable
    ) {
        return (
            pegRate,
            lastPegUpdate,
            lastPegUpdate + PEG_UPDATE_COOLDOWN
        );
    }

    // Override transfer functions to add pause functionality
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, amount);
    }


}
