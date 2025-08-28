'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { 
  CreditCard, 
  Send, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  Package,
  TrendingUp,
  Wallet as WalletIcon,
  ExternalLink,
  Copy,
  RefreshCw,
  Zap,
  Shield,
  Sword,
  Star,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import SimpleWalletConnection from '@/components/SimpleWalletConnection';
import { useWallet } from '@/components/WalletProvider';
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
  const { 
    krwBalance, 
    isLoadingBalance, 
    mintTestTokens, 
    sendTokens,
    ownedItems,
    isLoadingItems,
    refreshItems,
    isTransacting,
    lastTransaction
  } = useWallet();
  
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSend = async () => {
    if (!sendAmount || !sendAddress) {
      toast.error('Invalid Input', 'Please enter amount and recipient address');
      return;
    }

    try {
      await sendTokens(sendAddress, sendAmount);
      toast.success('Transaction Sent!', `Sent ${sendAmount} KRWGC to ${sendAddress.slice(0, 6)}...`);
      setSendAmount('');
      setSendAddress('');
    } catch (error) {
      toast.error('Transaction Failed', 'Please try again');
    }
  };

  const handleMint = async () => {
    try {
      await mintTestTokens();
      toast.success('Tokens Minted!', 'Added 10,000 KRWGC to your wallet');
    } catch (error) {
      toast.error('Minting Failed', 'Please try again');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!', 'Address copied to clipboard');
  };

  const getRarityColor = (rarity: number) => {
    const colors = {
      1: 'text-gray-600 bg-gray-100',
      2: 'text-green-600 bg-green-100',
      3: 'text-blue-600 bg-blue-100', 
      4: 'text-purple-600 bg-purple-100',
      5: 'text-yellow-600 bg-yellow-100'
    };
    return colors[rarity as keyof typeof colors] || colors[1];
  };

  const getRarityStars = (rarity: number) => {
    return Array.from({ length: rarity }, (_, i) => (
      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
    ));
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
        <SimpleWalletConnection />
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
                {isLoadingBalance ? (
                  <div className="animate-pulse bg-white/20 h-8 w-24 rounded"></div>
                ) : (
                  formatNumber(parseFloat(krwBalance).toFixed(0))
                )}
              </div>
              <div className="text-sm opacity-80">
                ≈ ${(parseFloat(krwBalance) * 0.00075).toFixed(2)} USD
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
                {isLoadingItems ? (
                  <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
                ) : (
                  ownedItems.length
                )}
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
        <div className="flex space-x-2">
          <button
            onClick={() => copyToClipboard(address || '')}
            className="btn-secondary text-sm flex items-center space-x-1"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
          <button
            onClick={refreshItems}
            className="btn-secondary text-sm flex items-center space-x-1"
            disabled={isLoadingItems}
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingItems ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
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
              disabled={isTransacting}
              className="card hover:shadow-lg transition-all duration-300 group disabled:opacity-50"
            >
              <div className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                  {isTransacting ? (
                    <RefreshCw className="w-6 h-6 text-green-600 animate-spin" />
                  ) : (
                    <Plus className="w-6 h-6 text-green-600" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Get Test Tokens</div>
                  <div className="text-sm text-gray-600">
                    {isTransacting ? 'Minting...' : 'Mint 10,000 KRWGC for demo'}
                  </div>
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
                  Available: {formatNumber(parseFloat(krwBalance).toFixed(0))} KRWGC
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={!sendAmount || !sendAddress || isTransacting}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTransacting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Send Transaction'
                )}
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
              {ownedItems.length} item{ownedItems.length !== 1 ? 's' : ''}
            </div>
          </div>

          {isLoadingItems ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : ownedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedItems.map((item) => (
                <div key={item.tokenId} className="card">
                  <div className="aspect-square bg-gray-100 overflow-hidden flex items-center justify-center">
                    {item.itemType === 'sword' && <Sword className="w-24 h-24 text-orange-500" />}
                    {item.itemType === 'shield' && <Shield className="w-24 h-24 text-blue-500" />}
                    {item.itemType !== 'sword' && item.itemType !== 'shield' && <Package className="w-24 h-24 text-purple-500" />}
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {item.itemType} #{item.tokenId}
                        </h4>
                        <div className="flex">{getRarityStars(item.rarity)}</div>
                      </div>
                      <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRarityColor(item.rarity)}`}>
                        {item.game}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="font-semibold text-red-600">⚔️ {item.attack}</div>
                        <div className="text-xs text-gray-500">Attack</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-semibold text-blue-600">🛡️ {item.defense}</div>
                        <div className="text-xs text-gray-500">Defense</div>
                      </div>
                    </div>
                    
                    <button className="w-full btn-secondary text-sm">
                      List for Sale
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Items Yet</h3>
              <p className="text-gray-600">Start your adventure and collect epic gaming items!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
