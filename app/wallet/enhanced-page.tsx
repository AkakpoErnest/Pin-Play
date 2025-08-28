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
import WalletConnection from '@/components/WalletConnection';
import { useWallet } from '@/components/WalletProvider';
import { toast } from '@/components/ui/Toaster';

export default function EnhancedWalletPage() {
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

  const formatNumber = (num: string) => {
    return new Intl.NumberFormat().format(parseInt(num));
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-dark-50 to-gaming-200">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-neon-blue shadow-lg shadow-neon-blue/50"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="text-center py-16 space-y-8 bg-gradient-to-br from-dark-50 via-dark-100 to-gaming-100 min-h-screen">
        <div className="space-y-6">
          <div className="relative">
            <WalletIcon className="w-32 h-32 text-neon-blue/50 mx-auto animate-float" />
            <div className="absolute inset-0 w-32 h-32 mx-auto bg-neon-blue/20 rounded-full blur-xl"></div>
          </div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
            Your Gaming Wallet
          </h1>
          <p className="text-2xl text-white max-w-3xl mx-auto leading-relaxed">
            Connect your wallet to access your <span className="text-neon-yellow font-bold">KRW Game Credits</span> and 
            manage your epic gaming assets
          </p>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-green to-neon-blue rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-energy-pulse"></div>
          <div className="relative">
            <WalletConnection />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-br from-dark-50 via-dark-100 to-gaming-100 min-h-screen">
      {/* Epic Header */}
      <div className="text-center space-y-6 py-8">
        <h1 className="text-6xl font-black bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent animate-neon-pulse">
          GAMING WALLET
        </h1>
        <p className="text-2xl text-white max-w-3xl mx-auto">
          Your blockchain-powered arsenal of digital assets and credits
        </p>
      </div>

      {/* Enhanced Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KRW Balance Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 backdrop-blur-sm border-2 border-neon-blue/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <CreditCard className="w-10 h-10 text-neon-blue animate-glow" />
              <span className="text-sm text-neon-blue font-bold uppercase tracking-wider">KRWGC</span>
            </div>
            <div>
              <div className="text-4xl font-black text-white">
                {isLoadingBalance ? (
                  <div className="animate-pulse bg-white/20 h-10 w-32 rounded"></div>
                ) : (
                  formatNumber(parseFloat(krwBalance).toFixed(0))
                )}
              </div>
              <div className="text-neon-green font-semibold">
                ≈ ${(parseFloat(krwBalance) * 0.00075).toFixed(2)} USD
              </div>
            </div>
            <button
              onClick={() => setActiveTab('send')}
              className="w-full py-2 px-4 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50 rounded-lg text-neon-blue font-semibold transition-all duration-200 hover:scale-105"
            >
              Quick Send
            </button>
          </div>
        </div>

        {/* Portfolio Value Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-green to-neon-yellow rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-neon-green/20 to-neon-yellow/20 backdrop-blur-sm border-2 border-neon-green/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-10 h-10 text-neon-green animate-power-up" />
              <span className="text-sm text-neon-green font-bold uppercase tracking-wider">Portfolio</span>
            </div>
            <div>
              <div className="text-4xl font-black text-white">
                {formatNumber('98250')}
              </div>
              <div className="text-neon-yellow font-semibold">
                +15.7% this week 🚀
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="w-2 h-8 bg-neon-green rounded animate-level-up"></div>
              <div className="w-2 h-6 bg-neon-green/70 rounded animate-level-up" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-10 bg-neon-green rounded animate-level-up" style={{animationDelay: '0.4s'}}></div>
              <div className="w-2 h-4 bg-neon-green/70 rounded animate-level-up" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>
        </div>

        {/* Items Owned Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 backdrop-blur-sm border-2 border-neon-purple/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Package className="w-10 h-10 text-neon-purple animate-cyber-glitch" />
              <span className="text-sm text-neon-purple font-bold uppercase tracking-wider">Items</span>
            </div>
            <div>
              <div className="text-4xl font-black text-white">
                {isLoadingItems ? (
                  <div className="animate-pulse bg-white/20 h-10 w-16 rounded"></div>
                ) : (
                  ownedItems.length
                )}
              </div>
              <div className="text-neon-pink font-semibold">
                Epic gaming assets
              </div>
            </div>
            <button
              onClick={() => setActiveTab('items')}
              className="w-full py-2 px-4 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/50 rounded-lg text-neon-purple font-semibold transition-all duration-200 hover:scale-105"
            >
              View Collection
            </button>
          </div>
        </div>
      </div>

      {/* Connected Address - Gaming Style */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-600 to-dark-800 rounded-xl blur opacity-50"></div>
        <div className="relative bg-gradient-to-r from-dark-600/50 to-dark-800/50 backdrop-blur-sm border-2 border-neon-blue/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
              <WalletIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-neon-blue font-bold uppercase tracking-wider">Connected Wallet</div>
              <div className="font-mono text-xl text-white">{formatAddress(address || '')}</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => copyToClipboard(address || '')}
              className="p-3 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50 rounded-lg text-neon-blue transition-all duration-200 hover:scale-105"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={refreshItems}
              className="p-3 bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green/50 rounded-lg text-neon-green transition-all duration-200 hover:scale-105"
              disabled={isLoadingItems}
            >
              <RefreshCw className={`w-5 h-5 ${isLoadingItems ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="flex space-x-2 bg-gradient-to-r from-dark-600/50 to-dark-800/50 backdrop-blur-sm border-2 border-neon-blue/20 p-2 rounded-xl">
        {[
          { id: 'overview', label: 'OVERVIEW', icon: TrendingUp },
          { id: 'send', label: 'SEND', icon: Send },
          { id: 'history', label: 'HISTORY', icon: Clock },
          { id: 'items', label: 'MY ITEMS', icon: Package }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-lg shadow-neon-blue/30 animate-energy-pulse'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Enhanced Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-green to-neon-yellow rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <button
                onClick={handleMint}
                disabled={isTransacting}
                className="relative w-full bg-gradient-to-br from-neon-green/20 to-neon-yellow/20 backdrop-blur-sm border-2 border-neon-green/30 rounded-xl p-6 hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-neon-green/20 rounded-xl flex items-center justify-center">
                    {isTransacting ? (
                      <RefreshCw className="w-8 h-8 text-neon-green animate-spin" />
                    ) : (
                      <Plus className="w-8 h-8 text-neon-green" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-black text-xl text-white">Get Test Tokens</div>
                    <div className="text-neon-green font-semibold">Mint 10,000 KRWGC for demo</div>
                  </div>
                </div>
              </button>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <button
                onClick={() => setActiveTab('send')}
                className="relative w-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 backdrop-blur-sm border-2 border-neon-blue/30 rounded-xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-neon-blue/20 rounded-xl flex items-center justify-center">
                    <Send className="w-8 h-8 text-neon-blue" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-xl text-white">Send Tokens</div>
                    <div className="text-neon-blue font-semibold">Transfer KRWGC instantly</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Transaction Status */}
          {lastTransaction && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-green to-neon-blue rounded-xl blur opacity-30"></div>
              <div className="relative bg-gradient-to-br from-neon-green/20 to-neon-blue/20 backdrop-blur-sm border-2 border-neon-green/30 rounded-xl p-4 flex items-center space-x-4">
                <CheckCircle className="w-8 h-8 text-neon-green" />
                <div>
                  <div className="font-bold text-white">Last Transaction Successful!</div>
                  <div className="text-neon-green">Your wallet has been updated</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Send Tab */}
      {activeTab === 'send' && (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-600 to-dark-800 rounded-xl blur opacity-50"></div>
          <div className="relative bg-gradient-to-br from-dark-600/50 to-dark-800/50 backdrop-blur-sm border-2 border-neon-blue/30 rounded-xl p-8 space-y-6">
            <h3 className="text-3xl font-black text-white text-center bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Send KRW Game Credits
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-neon-blue mb-3 uppercase tracking-wider">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={sendAddress}
                  onChange={(e) => setSendAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full py-4 px-6 bg-dark-800/50 border-2 border-neon-blue/30 rounded-xl text-white placeholder-gray-400 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-neon-blue mb-3 uppercase tracking-wider">
                  Amount (KRWGC)
                </label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0"
                  className="w-full py-4 px-6 bg-dark-800/50 border-2 border-neon-blue/30 rounded-xl text-white placeholder-gray-400 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all duration-200"
                />
                <div className="mt-3 text-neon-green font-semibold">
                  Available: {formatNumber(parseFloat(krwBalance).toFixed(0))} KRWGC
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={!sendAmount || !sendAddress || isTransacting}
                className="w-full py-4 px-6 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-black text-lg uppercase tracking-wider rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300 shadow-lg shadow-neon-blue/30"
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

      {/* Enhanced Items Tab */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-black text-white bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
              MY EPIC COLLECTION
            </h3>
            <div className="text-neon-purple font-bold">
              {ownedItems.length} legendary item{ownedItems.length !== 1 ? 's' : ''}
            </div>
          </div>

          {isLoadingItems ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-dark-800/50 rounded-xl p-6 animate-pulse">
                  <div className="h-40 bg-white/10 rounded-lg mb-4"></div>
                  <div className="h-6 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : ownedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedItems.map((item) => (
                <div key={item.tokenId} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-dark-600/50 to-dark-800/50 backdrop-blur-sm border-2 border-neon-purple/30 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300">
                    {/* Item Image/Icon */}
                    <div className="h-48 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 flex items-center justify-center">
                      {item.itemType === 'sword' && <Sword className="w-24 h-24 text-neon-orange" />}
                      {item.itemType === 'shield' && <Shield className="w-24 h-24 text-neon-blue" />}
                      {item.itemType !== 'sword' && item.itemType !== 'shield' && <Package className="w-24 h-24 text-neon-purple" />}
                    </div>
                    
                    <div className="p-6 space-y-4">
                      {/* Item Header */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-black text-lg text-white truncate">
                            {item.itemType.charAt(0).toUpperCase() + item.itemType.slice(1)} #{item.tokenId}
                          </h4>
                          <div className="flex">{getRarityStars(item.rarity)}</div>
                        </div>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRarityColor(item.rarity)}`}>
                          {item.game}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-neon-red font-bold">⚔️ {item.attack}</div>
                          <div className="text-xs text-gray-400">Attack</div>
                        </div>
                        <div className="text-center">
                          <div className="text-neon-blue font-bold">🛡️ {item.defense}</div>
                          <div className="text-xs text-gray-400">Defense</div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-full py-3 px-4 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold rounded-lg hover:scale-105 transition-all duration-200">
                        List for Sale
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Items Yet</h3>
              <p className="text-gray-400">Start your adventure and collect epic gaming items!</p>
            </div>
          )}
        </div>
      )}

      {/* History Tab would go here - similar enhanced styling */}
      {activeTab === 'history' && (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-600 to-dark-800 rounded-xl blur opacity-50"></div>
          <div className="relative bg-gradient-to-br from-dark-600/50 to-dark-800/50 backdrop-blur-sm border-2 border-neon-blue/30 rounded-xl p-8">
            <h3 className="text-3xl font-black text-white text-center bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent mb-8">
              TRANSACTION HISTORY
            </h3>
            <div className="text-center py-16">
              <Clock className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">History Coming Soon</h3>
              <p className="text-gray-400">Real-time transaction tracking will be available here!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


