'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { 
  CreditCard, 
  Send, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  Package,
  TrendingUp,
  Wallet as WalletIcon,
  ExternalLink
} from 'lucide-react';
import WalletConnection from '@/components/WalletConnection';
import { toast } from '@/components/ui/Toaster';

// Mock transaction history
const mockTransactions = [
  {
    id: '1',
    type: 'purchase',
    item: 'Legendary Dragon Sword',
    amount: '-25000',
    timestamp: '2024-01-15T10:30:00Z',
    hash: '0xabcd...1234',
    status: 'completed'
  },
  {
    id: '2', 
    type: 'sale',
    item: 'Magic Potion x5',
    amount: '+2500',
    timestamp: '2024-01-14T15:45:00Z',
    hash: '0xefgh...5678',
    status: 'completed'
  },
  {
    id: '3',
    type: 'mint',
    item: 'KRW Game Credits',
    amount: '+50000',
    timestamp: '2024-01-14T09:15:00Z',
    hash: '0xijkl...9012',
    status: 'completed'
  },
  {
    id: '4',
    type: 'purchase',
    item: 'Elite Armor Set',
    amount: '-40000',
    timestamp: '2024-01-13T14:20:00Z',
    hash: '0xmnop...3456',
    status: 'completed'
  }
];

// Mock owned items
const mockOwnedItems = [
  {
    id: 1,
    name: "Mystic Shield of Valor",
    type: "shield",
    rarity: 4,
    estimatedValue: "15000",
    image: "https://via.placeholder.com/150x150/7C3AED/ffffff?text=🛡️",
    game: "demo-rpg"
  },
  {
    id: 2,
    name: "Health Potion x3",
    type: "potion",
    rarity: 1,
    estimatedValue: "1500",
    image: "https://via.placeholder.com/150x150/059669/ffffff?text=🧪",
    game: "demo-rpg"
  },
  {
    id: 3,
    name: "Swift Bow",
    type: "bow",
    rarity: 3,
    estimatedValue: "12000",
    image: "https://via.placeholder.com/150x150/EA580C/ffffff?text=🏹",
    game: "demo-rpg"
  }
];

export default function WalletPage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');

  // Mock balance data
  const mockBalance = {
    krwgc: '127500', // KRW Game Credits
    eth: '0.025',    // ETH
    usd: '98.50'     // USD equivalent
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSend = async () => {
    if (!sendAmount || !sendAddress) {
      toast.error('Invalid Input', 'Please enter amount and recipient address');
      return;
    }

    try {
      toast.info('Sending Transaction', 'Confirming transaction...');
      // Mock sending - in real app would interact with smart contracts
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Transaction Sent!', `Sent ${sendAmount} KRWGC to ${sendAddress.slice(0, 6)}...`);
      setSendAmount('');
      setSendAddress('');
    } catch (error) {
      toast.error('Transaction Failed', 'Please try again');
    }
  };

  const handleMint = async () => {
    try {
      toast.info('Minting Tokens', 'Requesting KRW Game Credits...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Tokens Minted!', 'Added 10,000 KRWGC to your wallet');
    } catch (error) {
      toast.error('Minting Failed', 'Please try again');
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="text-center py-16 space-y-8">
        <div className="space-y-4">
          <WalletIcon className="w-24 h-24 text-gray-400 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900">Your Wallet</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect your wallet to view your KRW Game Credits balance and transaction history
          </p>
        </div>
        <WalletConnection />
      </div>
    );
  }

  const formatNumber = (num: string) => {
    return new Intl.NumberFormat().format(parseInt(num));
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold heading-gradient">Your Wallet</h1>
        <p className="text-xl text-gray-600">
          Manage your KRW Game Credits and digital assets
        </p>
      </div>

      {/* Wallet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KRW Game Credits Balance */}
        <div className="card bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <CreditCard className="w-8 h-8 opacity-80" />
              <span className="text-sm opacity-80">KRWGC</span>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {formatNumber(mockBalance.krwgc)}
              </div>
              <div className="text-sm opacity-80">
                ≈ ${mockBalance.usd} USD
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Value */}
        <div className="card">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <span className="text-sm text-gray-600">Portfolio</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {formatNumber('155000')}
              </div>
              <div className="text-sm text-green-600">
                +12.5% this month
              </div>
            </div>
          </div>
        </div>

        {/* Items Owned */}
        <div className="card">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Package className="w-8 h-8 text-purple-500" />
              <span className="text-sm text-gray-600">Items</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {mockOwnedItems.length}
              </div>
              <div className="text-sm text-gray-600">
                Digital assets owned
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Address */}
      <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">Connected Address</div>
          <div className="font-mono text-lg">{formatAddress(address || '')}</div>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(address || '')}
          className="btn-secondary text-sm"
        >
          Copy
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'send', label: 'Send' },
          { id: 'history', label: 'History' },
          { id: 'items', label: 'My Items' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
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
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleMint}
              className="card hover:shadow-lg transition-all duration-300 group"
            >
              <div className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Get Test Tokens</div>
                  <div className="text-sm text-gray-600">Mint 10,000 KRWGC for demo</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('send')}
              className="card hover:shadow-lg transition-all duration-300 group"
            >
              <div className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                  <Send className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Send Tokens</div>
                  <div className="text-sm text-gray-600">Transfer KRWGC to another address</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'send' && (
        <div className="card">
          <div className="p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Send KRW Game Credits</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={sendAddress}
                  onChange={(e) => setSendAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (KRWGC)
                </label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0"
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="mt-2 text-sm text-gray-600">
                  Available: {formatNumber(mockBalance.krwgc)} KRWGC
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={!sendAmount || !sendAddress}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card">
          <div className="p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Transaction History</h3>
            
            <div className="space-y-4">
              {mockTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.type === 'purchase' ? 'bg-red-100 text-red-600' :
                      tx.type === 'sale' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {tx.type === 'purchase' ? <ArrowUpRight className="w-5 h-5" /> :
                       tx.type === 'sale' ? <ArrowDownLeft className="w-5 h-5" /> :
                       <Plus className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{tx.item}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-semibold ${
                      tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.amount} KRWGC
                    </div>
                    <div className="text-sm text-gray-600 flex items-center space-x-1">
                      <span>{formatAddress(tx.hash)}</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'items' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">My Items</h3>
            <div className="text-sm text-gray-600">
              {mockOwnedItems.length} item{mockOwnedItems.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockOwnedItems.map((item) => (
              <div key={item.id} className="card">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{item.type} • {item.game}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-600">Estimated Value</div>
                      <div className="font-semibold text-gray-900">
                        {formatNumber(item.estimatedValue)} KRWGC
                      </div>
                    </div>
                    
                    <button className="btn-secondary text-sm">
                      List for Sale
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
