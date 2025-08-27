'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { 
  CreditCard, 
  Gamepad2, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users,
  ArrowRight,
  Star,
  Globe
} from 'lucide-react';
import WalletConnection from '@/components/WalletConnection';
import FeatureCard from '@/components/FeatureCard';
import StatCard from '@/components/StatCard';

export default function HomePage() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-neon-pink/20 to-neon-yellow/20 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-gaming-400/20 to-gaming-600/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Hero Section */}
      <section className="text-center space-y-8 py-12 relative">
        <div className="space-y-6 animate-slide-up">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-gaming-100 to-gaming-200 text-gaming-800 px-6 py-3 rounded-full text-sm font-medium border border-gaming-300 shadow-lg">
            <Star className="w-5 h-5 text-gaming-600" />
            <span className="font-semibold">Korea Stablecoin Hackathon Project</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-gaming-600 via-neon-purple to-neon-blue bg-clip-text text-transparent leading-tight animate-neon-pulse">
            KRW Game Credits
          </h1>
          
          <div className="relative">
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
              🎮 Frictionless NFT & in-game purchase ecosystem powered by 
              <span className="text-krw-600 font-bold"> KRW stablecoin</span>. 
              Enabling instant, low-fee, borderless payments for gamers and creators.
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gaming-100/30 to-transparent blur-sm -z-10"></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{animationDelay: '0.2s'}}>
          {isConnected ? (
            <div className="flex flex-col sm:flex-row gap-6">
              <Link 
                href="/marketplace" 
                className="group relative overflow-hidden bg-gradient-to-r from-gaming-600 to-gaming-700 hover:from-gaming-700 hover:to-gaming-800 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-gaming-500/25 inline-flex items-center space-x-3 text-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Gamepad2 className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Explore Marketplace</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link 
                href="/wallet" 
                className="group relative overflow-hidden bg-gradient-to-r from-dark-700 to-dark-800 hover:from-dark-600 hover:to-dark-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-dark-500/25 inline-flex items-center space-x-3 text-lg border border-dark-600"
              >
                <CreditCard className="w-6 h-6" />
                <span>Manage Wallet</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6 animate-pulse">
              <div className="transform scale-110">
                <WalletConnection />
              </div>
              <p className="text-gray-600 font-medium">
                🚀 Connect your wallet to start trading game items with KRW stablecoin
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
          <StatCard 
            icon={<TrendingUp className="w-6 h-6" />}
            value="$2.4M"
            label="Total Volume"
            color="text-green-600"
          />
          <StatCard 
            icon={<Users className="w-6 h-6" />}
            value="15,432"
            label="Active Users"
            color="text-blue-600"
          />
          <StatCard 
            icon={<Gamepad2 className="w-6 h-6" />}
            value="48"
            label="Integrated Games"
            color="text-purple-600"
          />
          <StatCard 
            icon={<Globe className="w-6 h-6" />}
            value="23"
            label="Countries"
            color="text-indigo-600"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-900">
            Why Choose KRW Game Credits?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built specifically for the gaming ecosystem with cutting-edge blockchain technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<CreditCard className="w-8 h-8 text-blue-500" />}
            title="KRW Stablecoin Payments"
            description="Stable, predictable pricing in Korean Won. No more volatility concerns for gamers and developers."
            color="blue"
          />
          
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-yellow-500" />}
            title="Instant Settlements"
            description="Lightning-fast transactions with minimal gas fees. Perfect for micro-transactions and in-game purchases."
            color="yellow"
          />
          
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-green-500" />}
            title="Secure & Transparent"
            description="Built on blockchain with smart contract security. All transactions are verifiable and immutable."
            color="green"
          />
          
          <FeatureCard
            icon={<Gamepad2 className="w-8 h-8 text-purple-500" />}
            title="Gaming-First Design"
            description="Optimized for game mechanics with features like item locking, durability, and rarity systems."
            color="purple"
          />
          
          <FeatureCard
            icon={<Users className="w-8 h-8 text-indigo-500" />}
            title="Developer Revenue Share"
            description="Game developers earn revenue from every transaction. Built-in royalty and fee distribution system."
            color="indigo"
          />
          
          <FeatureCard
            icon={<Globe className="w-8 h-8 text-pink-500" />}
            title="Cross-Border Ready"
            description="Enable global player bases with easy currency conversion and international payment support."
            color="pink"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold">Connect Wallet</h3>
              <p className="text-gray-600">
                Connect your Web3 wallet and get some KRW stablecoin to start trading
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold">Browse & Buy</h3>
              <p className="text-gray-600">
                Explore game items from various titles and purchase with stable KRW pricing
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold">Use In Game</h3>
              <p className="text-gray-600">
                Your items are instantly available in supported games with full ownership rights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-8 py-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-gray-900">
            Ready to Start Gaming?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of gamers already using KRW Game Credits for seamless in-game purchases
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/marketplace" 
            className="btn-primary inline-flex items-center space-x-2 px-8 py-4 text-lg"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/developers" 
            className="btn-secondary inline-flex items-center space-x-2 px-8 py-4 text-lg"
          >
            <span>For Developers</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
