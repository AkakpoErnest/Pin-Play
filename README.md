# KRW Game Credits

> **Blockchain-native Payment Layer for NFTs and In-Game Purchases**

A frictionless NFT & in-game purchase ecosystem powered by KRW stablecoin, enabling users to buy NFTs, game items, and digital content instantly with low fees and cross-border accessibility.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.19.0-purple)](https://hardhat.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)](https://nextjs.org/)

## 🎯 Project Overview

KRW Game Credits was built for the **Korea Stablecoin Hackathon** to bridge finance and everyday gaming life through blockchain technology. Our platform enables:

- **Instant Payments**: Lightning-fast transactions with KRW stablecoin
- **Gaming-First Design**: Optimized for game mechanics with item locking, durability, and rarity systems
- **Developer Revenue Share**: Game developers earn revenue from every transaction
- **Cross-Border Support**: Global player bases with easy currency conversion
- **Security & Transparency**: All transactions secured by blockchain technology

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   KRW Stablecoin│    │  Game Item NFT  │    │ Game Marketplace│
│                 │    │                 │    │                 │
│ • ERC20 Token   │    │ • ERC721 NFTs   │    │ • Buy/Sell     │
│ • Minting       │◄──►│ • Game Items    │◄──►│ • Auctions     │
│ • Pegging       │    │ • Rarity System │    │ • Revenue Share│
│ • Stability     │    │ • Stats/Durabil.│    │ • Fee Management│
└─────────────────┘    └─────────────────┘    └─────────────────┘
          ▲                        ▲                        ▲
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   │
                    ┌─────────────────────────────────┐
                    │         Frontend App            │
                    │                                 │
                    │ • Next.js + React              │
                    │ • Web3 Integration (wagmi)     │
                    │ • RainbowKit Wallet Connection │
                    │ • Marketplace UI               │
                    │ • Demo Game                    │
                    └─────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/krw-game-credits.git
   cd krw-game-credits
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Blockchain Configuration
   PRIVATE_KEY=your_private_key_here
   SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
   
   # Next.js Configuration  
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
   ```

4. **Compile smart contracts**
   ```bash
   npm run compile
   ```

5. **Deploy to local network**
   ```bash
   # Start local Hardhat node
   npm run node
   
   # In another terminal, deploy contracts
   npm run deploy:testnet
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Features

### Smart Contracts

#### KRWStablecoin.sol
- **ERC20 compliant** KRW-pegged stablecoin
- **Minting/Burning** with authorized minter system
- **Oracle integration** for price stability
- **Pausable** for emergency situations
- **Permit functionality** for gasless approvals

#### GameItemNFT.sol  
- **ERC721 compliant** NFTs representing game items
- **Gaming-specific metadata** (attack, defense, durability)
- **Rarity system** (1-5 stars)
- **Game authorization** system
- **Item locking** for game mechanics
- **Batch minting** for efficiency

#### GameMarketplace.sol
- **Direct purchases** with KRW stablecoin
- **Auction functionality** with bidding
- **Revenue sharing** for game developers
- **Fee management** and royalty distribution
- **Bulk purchase** support
- **Emergency controls**

### Frontend Application

#### Core Pages
- **Home**: Landing page with features and statistics
- **Marketplace**: Browse and purchase game items
- **Wallet**: Manage KRWGC balance and view transaction history
- **Demo Game**: Interactive RPG showcasing the payment system
- **Developers**: SDK documentation and integration guide

#### Key Components
- **Web3 Integration**: RainbowKit + wagmi for wallet connections
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Real-time Updates**: Live balance and transaction updates
- **Toast Notifications**: User feedback for all actions
- **Gaming UI**: Rarity colors, stat displays, inventory management

### Developer SDK

The KRW Game SDK provides easy integration for game developers:

```typescript
import KRWGameSDK from 'krw-game-sdk';

const sdk = new KRWGameSDK({
  rpcUrl: 'your-rpc-url',
  contractAddresses: { /* contract addresses */ },
  gameId: 'your-game-id'
});

// Process a purchase
const result = await sdk.processPurchase({
  itemId: 123,
  buyerAddress: playerAddress,
  paymentAmount: ethers.parseEther("5000").toString()
});
```

## 🧪 Testing

### Smart Contract Tests
```bash
npm run test
```

### Frontend Testing
```bash
# Run development server
npm run dev

# Test wallet connection
# Test marketplace purchases
# Test demo game functionality
```

## 📦 Deployment

### Testnet Deployment (Sepolia)
```bash
npm run deploy:testnet
```

### Mainnet Deployment
```bash
npm run deploy:mainnet
```

### Deployment Verification
```bash
# Verify contracts on Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS "constructor_args"
```

## 🎯 Use Cases

### For Gamers
- **Purchase game items** with stable KRW pricing
- **True ownership** of digital assets via NFTs
- **Cross-game compatibility** for certain items
- **Instant transactions** without traditional payment delays
- **Global accessibility** regardless of location

### For Game Developers
- **Easy integration** with simple SDK
- **Revenue sharing** from marketplace transactions
- **Reduced payment processing** costs and complexity
- **Global reach** without multiple payment processors
- **Blockchain security** and transparency

### For the Gaming Ecosystem
- **Standardized payments** across games
- **Interoperable assets** between compatible games
- **Transparent marketplace** with verifiable transactions
- **Reduced fraud** through blockchain verification
- **Community-driven** economy

## 📚 API Documentation

### KRW Game SDK Methods

#### Balance Management
```typescript
// Get player balance
const balance = await sdk.getBalance(playerAddress);

// Check if player can afford item
const canAfford = await sdk.canAfford(playerAddress, itemPrice);
```

#### Item Management
```typescript
// Mint new item
const txHash = await sdk.mintItem(playerAddress, itemData);

// Get player's items
const items = await sdk.getPlayerItems(playerAddress);
```

#### Marketplace Integration
```typescript
// Process purchase
const result = await sdk.processPurchase(purchaseRequest);

// Listen for purchase events
sdk.onPurchase((event) => {
  console.log('New purchase:', event);
});
```

#### Payment Widget
```typescript
// Create embedded payment widget
sdk.createPaymentWidget('payment-container', {
  itemId: 123,
  price: "5000",
  onSuccess: (result) => grantItemToPlayer(result),
  onError: (error) => showErrorMessage(error)
});
```

## 🛣️ Roadmap

### Phase 1: MVP (Current)
- ✅ Smart contract development
- ✅ Frontend marketplace
- ✅ Developer SDK
- ✅ Demo game integration
- ✅ Basic documentation

### Phase 2: Enhancement
- [ ] Mobile app development
- [ ] Advanced auction features
- [ ] Cross-chain bridge integration
- [ ] Enhanced analytics dashboard
- [ ] Community governance features

### Phase 3: Ecosystem Growth
- [ ] Game studio partnerships
- [ ] Integration with major game engines
- [ ] Advanced DeFi features
- [ ] NFT fractionalization
- [ ] Metaverse compatibility

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write clear commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Korea Stablecoin Hackathon** organizers
- **Kaia blockchain** ecosystem
- **OpenZeppelin** for secure smart contract libraries
- **RainbowKit** and **wagmi** for Web3 integration
- **Next.js** and **Tailwind CSS** for the frontend

## 📞 Support

- **Documentation**: [docs.krwgamecredits.com](https://docs.krwgamecredits.com)
- **Discord**: [Join our community](https://discord.gg/krwgamecredits)
- **Twitter**: [@KRWGameCredits](https://twitter.com/KRWGameCredits)
- **Email**: support@krwgamecredits.com

## 🎊 Demo

Experience KRW Game Credits live:
- **Live Demo**: [https://krwgamecredits.vercel.app](https://krwgamecredits.vercel.app)
- **Demo Video**: [Watch on YouTube](https://youtube.com/watch?v=demo)
- **Pitch Deck**: [View Presentation](https://pitch.krwgamecredits.com)

---

**Built with ❤️ for the Korea Stablecoin Hackathon**

*Bridging finance and gaming through blockchain innovation*
