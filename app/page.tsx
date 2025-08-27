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
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            <Star className="w-4 h-4" />
            <span>Korea Stablecoin Hackathon Project</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold heading-gradient leading-tight">
            KRW Game Credits
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Frictionless NFT & in-game purchase ecosystem powered by KRW stablecoin. 
            Enabling instant, low-fee, borderless payments for gamers and creators.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isConnected ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/marketplace" 
                className="btn-primary inline-flex items-center space-x-2 px-8 py-4 text-lg"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/wallet" 
                className="btn-secondary inline-flex items-center space-x-2 px-8 py-4 text-lg"
              >
                <CreditCard className="w-5 h-5" />
                <span>Manage Wallet</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <WalletConnection />
              <p className="text-sm text-gray-500">
                Connect your wallet to start trading game items with KRW stablecoin
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
