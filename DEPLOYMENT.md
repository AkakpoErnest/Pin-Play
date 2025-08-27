# Deployment Guide

This guide walks you through deploying KRW Game Credits to various networks.

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+** and npm
2. **Git** for version control
3. **MetaMask** or compatible Web3 wallet
4. **Alchemy API key** (for testnets/mainnet)
5. **Private key** with funds for deployment

### Environment Setup

1. Clone and install dependencies:
   ```bash
   git clone <repository-url>
   cd krw-game-credits
   npm install
   ```

2. Create environment file:
   ```bash
   cp env.example .env.local
   ```

3. Update `.env.local` with your configuration:
   ```env
   # Blockchain Configuration
   PRIVATE_KEY=your_private_key_here
   SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
   ETHERSCAN_API_KEY=your_etherscan_api_key

   # Next.js Configuration
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
   ```

## 🏠 Local Development

### Start Local Blockchain

```bash
# Start Hardhat node
npm run node
```

### Deploy Contracts

```bash
# Deploy to local network
npm run deploy:testnet
```

### Start Frontend

```bash
# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Testnet Deployment

### Sepolia Testnet

1. **Get testnet ETH** from [Sepolia faucet](https://sepoliafaucet.com/)

2. **Update environment** with Sepolia configuration:
   ```env
   SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
   PRIVATE_KEY=0x... # Account with Sepolia ETH
   ```

3. **Deploy contracts**:
   ```bash
   npm run deploy:testnet
   ```

4. **Verify contracts** (optional):
   ```bash
   npx hardhat verify --network sepolia CONTRACT_ADDRESS "constructor_args"
   ```

### Other Testnets

To deploy to other testnets, update `hardhat.config.js`:

```javascript
networks: {
  goerli: {
    url: process.env.GOERLI_URL,
    accounts: [process.env.PRIVATE_KEY]
  },
  mumbai: {
    url: process.env.MUMBAI_URL,
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

## 🌍 Mainnet Deployment

⚠️ **Warning**: Mainnet deployment uses real funds. Test thoroughly on testnets first.

### Prerequisites

1. **Sufficient ETH** for deployment (~0.1-0.2 ETH for gas)
2. **Audited contracts** (recommended for production)
3. **Verified configurations** (oracle addresses, fee structures)

### Deployment Steps

1. **Update configuration** for mainnet:
   ```env
   MAINNET_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
   PRIVATE_KEY=0x... # SECURE private key
   ```

2. **Deploy contracts**:
   ```bash
   npm run deploy:mainnet
   ```

3. **Verify contracts**:
   ```bash
   npx hardhat verify --network mainnet CONTRACT_ADDRESS
   ```

## 📊 Post-Deployment

### Contract Verification

After deployment, verify contracts on Etherscan:

```bash
npx hardhat verify --network <network> <contract_address> [constructor_args]
```

### Frontend Configuration

Update contract addresses in your frontend:

1. Copy addresses from `contract-addresses.json`
2. Update environment variables
3. Redeploy frontend

### Testing

1. **Connect wallet** to the deployed network
2. **Test basic functions**:
   - Mint test tokens
   - Create game items
   - List items on marketplace
   - Process purchases
3. **Verify events** are emitted correctly
4. **Check gas costs** are reasonable

## 🔧 Configuration Options

### Smart Contract Parameters

#### KRW Stablecoin
- `oracle`: Price oracle address
- `initialPegRate`: Initial KRW/ETH exchange rate
- `collateralRatio`: Over-collateralization percentage (default: 150%)
- `stabilityFee`: Fee in basis points (default: 50 = 0.5%)

#### Game Marketplace
- `marketplaceFee`: Platform fee in basis points (default: 250 = 2.5%)
- `feeRecipient`: Address to receive platform fees

#### Game Item NFT
- `royaltyPercentage`: Creator royalty in basis points (default: 250 = 2.5%)

### Frontend Configuration

Update these environment variables:

```env
# Contract addresses (from deployment)
NEXT_PUBLIC_KRW_STABLECOIN_ADDRESS=0x...
NEXT_PUBLIC_GAME_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_GAME_NFT_ADDRESS=0x...

# Network configuration
NEXT_PUBLIC_CHAIN_ID=1 # 1 for mainnet, 11155111 for Sepolia
NEXT_PUBLIC_NETWORK_NAME=mainnet
```

## 🚨 Security Considerations

### Private Key Management

- **Never commit** private keys to version control
- **Use hardware wallets** for production deployments
- **Consider multi-sig** wallets for contract ownership

### Contract Security

- **Audit contracts** before mainnet deployment
- **Use timelock** for critical functions
- **Implement emergency pause** mechanisms
- **Monitor transactions** for unusual activity

### Access Controls

- **Limit minter permissions** to authorized addresses only
- **Use role-based access** for administrative functions
- **Regularly rotate** sensitive credentials

## 🔍 Monitoring & Maintenance

### Event Monitoring

Monitor key events for system health:

```javascript
// Monitor marketplace activity
marketplace.on('ItemSold', (tokenId, buyer, seller, price) => {
  console.log(`Item ${tokenId} sold for ${price} KRWGC`);
});

// Monitor token minting
nft.on('ItemMinted', (tokenId, recipient, itemType, rarity) => {
  console.log(`New ${itemType} minted: Token ${tokenId}`);
});
```

### Performance Metrics

Track important metrics:
- Transaction volume
- Active users
- Gas costs
- Error rates
- Revenue generated

### Upgrades

Plan for contract upgrades:
1. **Proxy patterns** for upgradeable contracts
2. **Migration scripts** for data transfer
3. **Backward compatibility** considerations
4. **User communication** strategy

## 📞 Support

### Documentation
- [Smart Contract API](./docs/contracts.md)
- [Frontend Integration](./docs/frontend.md)
- [SDK Documentation](./docs/sdk.md)

### Community
- [Discord Server](https://discord.gg/krwgamecredits)
- [GitHub Issues](https://github.com/krwgamecredits/issues)
- [Developer Forum](https://forum.krwgamecredits.com)

### Emergency Contacts
- **Security Issues**: security@krwgamecredits.com
- **Technical Support**: support@krwgamecredits.com
- **Partnership Inquiries**: partnerships@krwgamecredits.com

---

**⚡ Built for the Korea Stablecoin Hackathon**

*Bringing blockchain payments to the gaming world, one transaction at a time.*
