'use client';

import { useState } from 'react';
import { 
  Code, 
  Download, 
  Book, 
  Zap, 
  Shield, 
  Gamepad2,
  ExternalLink,
  Copy,
  CheckCircle,
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react';
import { toast } from '@/components/ui/Toaster';

const codeExamples = {
  installation: `npm install krw-game-sdk ethers`,
  
  initialization: `import KRWGameSDK from 'krw-game-sdk';

const sdk = new KRWGameSDK({
  rpcUrl: 'https://your-rpc-url.com',
  privateKey: process.env.PRIVATE_KEY, // Server-side only
  contractAddresses: {
    krwStablecoin: '0x...',
    gameItemNFT: '0x...',
    gameMarketplace: '0x...'
  },
  gameId: 'your-game-id'
});`,

  balance: `// Get player's KRW Game Credits balance
const balance = await sdk.getBalance(playerAddress);
console.log(\`Player has \${balance} KRWGC\`);`,

  mint: `// Mint a new game item
const item = {
  name: "Legendary Sword",
  type: "weapon",
  rarity: 5,
  attack: 150,
  defense: 20,
  durability: 100,
  metadataUri: "https://api.yourgame.com/metadata/1.json"
};

const txHash = await sdk.mintItem(playerAddress, item);`,

  purchase: `// Process in-game purchase
const result = await sdk.processPurchase({
  itemId: 123,
  buyerAddress: playerAddress,
  paymentAmount: ethers.parseEther("5000").toString()
});

if (result.success) {
  console.log('Purchase successful!', result.transactionHash);
} else {
  console.error('Purchase failed:', result.error);
}`,

  widget: `// Create payment widget for web games
sdk.createPaymentWidget('payment-container', {
  itemId: 123,
  price: "5000", // KRWGC
  onSuccess: (result) => {
    console.log('Payment successful!', result);
    // Grant item to player
  },
  onError: (error) => {
    console.error('Payment failed:', error);
    // Show error message
  }
});`,

  events: `// Listen for purchase events
sdk.onPurchase((event) => {
  console.log('New purchase:', {
    itemId: event.tokenId,
    buyer: event.buyer,
    price: event.price
  });
  
  // Update your game state
  grantItemToPlayer(event.buyer, event.tokenId);
});`
};

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Payments",
    description: "Process payments in seconds with KRW stablecoin. No waiting for bank transfers or credit card processing."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure & Transparent",
    description: "All transactions are secured by blockchain technology and publicly verifiable."
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Revenue Sharing",
    description: "Earn up to 20% revenue share from marketplace transactions for your game items."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Global Reach",
    description: "Accept payments from players worldwide without dealing with multiple payment processors."
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Easy Integration",
    description: "Simple SDK with just a few lines of code. Support for web, mobile, and game engines."
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Analytics Dashboard",
    description: "Track your revenue, player engagement, and marketplace performance in real-time."
  }
];

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success('Copied!', 'Code copied to clipboard');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <Code className="w-4 h-4" />
            <span>Developer SDK</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold heading-gradient leading-tight">
            Build with KRW Game Credits
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Integrate blockchain payments into your games with our simple SDK. 
            Accept KRW stablecoin payments and earn revenue share from every transaction.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="btn-primary inline-flex items-center space-x-2 px-8 py-4 text-lg">
            <Download className="w-5 h-5" />
            <span>Get Started</span>
          </button>
          <button className="btn-secondary inline-flex items-center space-x-2 px-8 py-4 text-lg">
            <Book className="w-5 h-5" />
            <span>View Docs</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-2xl mx-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'quickstart', label: 'Quick Start' },
          { id: 'examples', label: 'Code Examples' },
          { id: 'revenue', label: 'Revenue Model' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <section className="space-y-12">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card group">
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 text-blue-500 group-hover:text-blue-600 transition-colors duration-200">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
            <div className="text-center space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Join the Growing Ecosystem
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">48</div>
                  <div className="text-gray-600">Integrated Games</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">$2.4M</div>
                  <div className="text-gray-600">Developer Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600">15K</div>
                  <div className="text-gray-600">Active Players</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600">99.9%</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'quickstart' && (
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Quick Start Guide</h2>
            <p className="text-xl text-gray-600">
              Get up and running in minutes with our simple SDK
            </p>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="card">
              <div className="p-8 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Install the SDK</h3>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 relative">
                  <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                    <code>{codeExamples.installation}</code>
                  </pre>
                  <button
                    onClick={() => copyCode(codeExamples.installation, 'install')}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {copiedCode === 'install' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card">
              <div className="p-8 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Initialize the SDK</h3>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 relative">
                  <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                    <code>{codeExamples.initialization}</code>
                  </pre>
                  <button
                    onClick={() => copyCode(codeExamples.initialization, 'init')}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {copiedCode === 'init' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card">
              <div className="p-8 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Start Processing Payments</h3>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 relative">
                  <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                    <code>{codeExamples.purchase}</code>
                  </pre>
                  <button
                    onClick={() => copyCode(codeExamples.purchase, 'purchase')}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {copiedCode === 'purchase' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'examples' && (
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Code Examples</h2>
            <p className="text-xl text-gray-600">
              Common integration patterns and use cases
            </p>
          </div>

          <div className="space-y-8 max-w-5xl mx-auto">
            {Object.entries(codeExamples).slice(2).map(([key, code], index) => (
              <div key={key} className="card">
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  
                  <div className="bg-gray-900 rounded-lg p-4 relative">
                    <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                      <code>{code}</code>
                    </pre>
                    <button
                      onClick={() => copyCode(code, key)}
                      className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {copiedCode === key ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'revenue' && (
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Revenue Model</h2>
            <p className="text-xl text-gray-600">
              Earn revenue from every transaction in your game
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Breakdown */}
            <div className="card">
              <div className="p-8 space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">Revenue Breakdown</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-900">Game Developer Share</span>
                    <span className="text-2xl font-bold text-green-600">20%</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-900">Item Seller Share</span>
                    <span className="text-2xl font-bold text-blue-600">77.5%</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Platform Fee</span>
                    <span className="text-2xl font-bold text-gray-600">2.5%</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    * Revenue share applies to secondary marketplace transactions. 
                    Primary sales (minting) have customizable fee structures.
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue Calculator */}
            <div className="card">
              <div className="p-8 space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">Revenue Calculator</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Transaction Volume (KRWGC)
                    </label>
                    <input
                      type="number"
                      defaultValue="100000"
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600">Estimated Monthly Revenue</div>
                    <div className="text-3xl font-bold text-green-600">20,000 KRWGC</div>
                    <div className="text-sm text-gray-600">≈ $15.38 USD</div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">Projected Annual Revenue</div>
                    <div className="text-3xl font-bold text-blue-600">240,000 KRWGC</div>
                    <div className="text-sm text-gray-600">≈ $184.62 USD</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="text-center space-y-8 py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join the next generation of blockchain gaming. Start integrating KRW Game Credits today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
            Download SDK
          </button>
          <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-full transition-all duration-300">
            Contact Sales
          </button>
        </div>
      </section>
    </div>
  );
}
