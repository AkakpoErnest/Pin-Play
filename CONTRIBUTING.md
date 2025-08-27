# Contributing to KRW Game Credits

Thank you for your interest in contributing to KRW Game Credits! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful** and inclusive of all community members
- **Be constructive** in your feedback and criticism
- **Focus on what's best** for the community and project
- **Show empathy** towards other community members

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 18+ installed
- Git configured with your GitHub account
- MetaMask or compatible Web3 wallet for testing
- Basic understanding of:
  - TypeScript/JavaScript
  - React/Next.js
  - Solidity (for smart contract contributions)
  - Web3/Ethereum concepts

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   gh repo fork KRWGameCredits/krw-game-credits
   cd krw-game-credits
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start local development**
   ```bash
   # Start local blockchain
   npm run node
   
   # Deploy contracts (in another terminal)
   npm run deploy:testnet
   
   # Start frontend
   npm run dev
   ```

## 🔄 Development Workflow

### Branching Strategy

We use a feature branch workflow:

1. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** with clear, focused commits
   ```bash
   git add .
   git commit -m "feat: add new marketplace filter functionality"
   ```

3. **Push your branch** and create a pull request
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(marketplace): add item filtering by rarity
fix(wallet): resolve balance display issue
docs: update SDK integration guide
test(contracts): add GameMarketplace unit tests
```

## 📏 Coding Standards

### TypeScript/JavaScript

- **Use TypeScript** for all new code
- **Follow ESLint** and Prettier configurations
- **Use meaningful variable names** and clear function signatures
- **Add JSDoc comments** for public APIs
- **Prefer functional components** with hooks in React

```typescript
// Good
interface GameItem {
  id: number;
  name: string;
  rarity: number;
  price: string;
}

const GameItemCard: React.FC<{ item: GameItem }> = ({ item }) => {
  // Component implementation
};

// Avoid
const Card = ({ data }: any) => {
  // Implementation
};
```

### Solidity

- **Follow Solidity style guide** and best practices
- **Use OpenZeppelin** contracts when possible
- **Include comprehensive NatSpec** documentation
- **Implement proper access controls** and security measures
- **Add events** for important state changes

```solidity
// Good
/**
 * @dev Mints a new game item NFT
 * @param to The address to mint the NFT to
 * @param itemType The type of item to mint
 * @param rarity The rarity level (1-5)
 */
function mintGameItem(
    address to,
    string memory itemType,
    uint256 rarity
) external onlyAuthorizedMinter returns (uint256) {
    require(to != address(0), "GameItemNFT: mint to zero address");
    require(rarity >= 1 && rarity <= 5, "GameItemNFT: invalid rarity");
    
    // Implementation
}
```

### CSS/Styling

- **Use Tailwind CSS** for styling
- **Follow mobile-first** responsive design
- **Use semantic class names** for custom CSS
- **Maintain consistent spacing** and typography

```tsx
// Good
<div className="card p-6 space-y-4 hover:shadow-lg transition-all duration-300">
  <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
  <p className="text-gray-600 leading-relaxed">{description}</p>
</div>
```

## 🧪 Testing Guidelines

### Smart Contract Testing

- **Write comprehensive tests** for all contract functions
- **Test both success and failure cases**
- **Use descriptive test names**
- **Test edge cases** and boundary conditions

```javascript
describe("GameMarketplace", function () {
  describe("buyItem", function () {
    it("should successfully purchase an item with sufficient balance", async function () {
      // Test implementation
    });
    
    it("should revert when buyer has insufficient balance", async function () {
      // Test implementation
    });
  });
});
```

### Frontend Testing

- **Test critical user flows**
- **Ensure wallet connection works**
- **Verify responsive design** on different screen sizes
- **Test error handling** and edge cases

### Running Tests

```bash
# Smart contract tests
npm run test

# Frontend manual testing
npm run dev
# Test in browser with different scenarios
```

## 🔍 Pull Request Process

### Before Submitting

1. **Ensure your code follows** our coding standards
2. **Run all tests** and ensure they pass
3. **Update documentation** if needed
4. **Test your changes** thoroughly
5. **Rebase your branch** on the latest main

### Pull Request Template

When creating a pull request, include:

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] Edge cases considered

## Screenshots (if applicable)
Add screenshots showing the changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

### Review Process

1. **Automated checks** must pass (linting, tests)
2. **At least one reviewer** must approve
3. **Address feedback** promptly and professionally
4. **Maintainer will merge** after approval

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment information** (browser, wallet, etc.)
5. **Screenshots or error messages** if applicable

### Feature Requests

For feature requests, include:

1. **Problem description** - what issue does this solve?
2. **Proposed solution** - how should it work?
3. **Alternatives considered** - what other options exist?
4. **Additional context** - mockups, examples, etc.

### Issue Templates

Use our issue templates for:
- 🐛 Bug Report
- ✨ Feature Request
- 📝 Documentation Issue
- 🔒 Security Vulnerability

## 💡 Development Tips

### Local Development

```bash
# Reset local blockchain state
npm run node:reset

# Redeploy contracts
npm run deploy:local

# Run specific tests
npx hardhat test test/GameMarketplace.test.js

# Check contract sizes
npx hardhat size-contracts
```

### Debugging

- **Use browser dev tools** for frontend debugging
- **Console.log strategically** but remove before committing
- **Use Hardhat's console.log** in Solidity for debugging
- **Test with different wallet states** (empty, full, etc.)

### Performance

- **Optimize gas usage** in smart contracts
- **Minimize re-renders** in React components
- **Use loading states** for better UX
- **Implement proper error boundaries**

## 📚 Resources

### Documentation
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [OpenZeppelin Documentation](https://docs.openzeppelin.com/)

### Community
- [Discord Server](https://discord.gg/krwgamecredits)
- [GitHub Discussions](https://github.com/KRWGameCredits/krw-game-credits/discussions)
- [Twitter](https://twitter.com/KRWGameCredits)

## ❓ Questions?

If you have questions about contributing:

1. **Check existing issues** and discussions first
2. **Join our Discord** for real-time help
3. **Create a GitHub discussion** for general questions
4. **Email us** at dev@krwgamecredits.com

Thank you for contributing to KRW Game Credits! 🎮⚡
