'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CreditCard, 
  Gamepad2, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users,
  ArrowRight,
  Star,
  Globe,
  Trophy,
  Target,
  Rocket
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
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-dark-50 to-gaming-200">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-neon-blue shadow-lg shadow-neon-blue/50"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16 relative overflow-hidden bg-gradient-to-br from-dark-50 via-dark-100 to-gaming-100 min-h-screen">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Matrix Rain Effect */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-8 bg-gradient-to-b from-neon-green to-transparent animate-matrix"
              style={{
                left: `${i * 5}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${4 + (i % 3)}s`
              }}
            />
          ))}
        </div>
        
        {/* Floating Gaming Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-neon-blue/30 to-neon-purple/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-neon-pink/30 to-neon-yellow/30 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-gaming-400/30 to-gaming-600/30 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-60 right-1/3 w-28 h-28 bg-gradient-to-r from-neon-orange/25 to-neon-red/25 rounded-full blur-xl animate-game-bounce" style={{animationDelay: '0.5s'}}></div>
        
        {/* Rotating Gaming Icons */}
        <div className="absolute top-32 right-40 animate-rotate-slow">
          <Gamepad2 className="w-12 h-12 text-neon-blue/20" />
        </div>
        <div className="absolute bottom-40 left-20 animate-rotate-slow" style={{animationDelay: '2s'}}>
          <Trophy className="w-16 h-16 text-neon-purple/20" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="text-center space-y-12 py-16 relative">
        <div className="space-y-8 animate-slide-up">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyber-500/20 to-gaming-500/20 backdrop-blur-sm text-neon-blue px-8 py-4 rounded-full text-sm font-bold border border-neon-blue/30 shadow-lg shadow-neon-blue/20 animate-neon-border">
            <Star className="w-6 h-6 text-neon-yellow animate-power-up" />
            <span className="font-bold text-lg">🇰🇷 Korea Stablecoin Hackathon Project</span>
            <Rocket className="w-6 h-6 text-neon-orange animate-level-up" />
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent leading-tight animate-neon-pulse">
            KRW GAME ARENA
          </h1>
          
          <div className="relative">
            <p className="text-2xl md:text-3xl text-white max-w-5xl mx-auto leading-relaxed font-bold drop-shadow-lg">
              🎮 Enter the <span className="text-neon-green animate-cyber-glitch">ULTIMATE</span> gaming ecosystem! 
              Trade NFTs with <span className="text-neon-yellow font-black">KRW stablecoin</span> power. 
              <br />⚡ Zero lag. Maximum fun. Infinite possibilities! ⚡
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/10 to-transparent blur-sm -z-10 animate-energy-pulse"></div>
          </div>
          
          {/* Gaming Images Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
            <div className="relative group animate-hover-lift cursor-pointer">
              <Image
                src="/gaming-adventure.jpeg"
                alt="Gaming Adventure"
                width={300}
                height={200}
                className="rounded-2xl shadow-2xl shadow-neon-blue/25 border-2 border-neon-blue/30 group-hover:border-neon-blue transition-all duration-300 animate-neon-border"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-50/80 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                <span className="text-neon-blue font-bold">Digital Adventure</span>
              </div>
            </div>
            
            <div className="relative group animate-hover-lift cursor-pointer" style={{animationDelay: '0.1s'}}>
              <Image
                src="/game-controller.jpeg"
                alt="Game Controller"
                width={300}
                height={200}
                className="rounded-2xl shadow-2xl shadow-neon-purple/25 border-2 border-neon-purple/30 group-hover:border-neon-purple transition-all duration-300 animate-neon-border"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-50/80 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                <span className="text-neon-purple font-bold">Pro Controller</span>
              </div>
            </div>
            
            <div className="relative group animate-hover-lift cursor-pointer" style={{animationDelay: '0.2s'}}>
              <Image
                src="/stack-blocks.jpeg"
                alt="Stack Blocks Game"
                width={300}
                height={200}
                className="rounded-2xl shadow-2xl shadow-neon-green/25 border-2 border-neon-green/30 group-hover:border-neon-green transition-all duration-300 animate-neon-border"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-50/80 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                <span className="text-neon-green font-bold">Stack & Earn</span>
              </div>
            </div>
            
            <div className="relative group animate-hover-lift cursor-pointer" style={{animationDelay: '0.3s'}}>
              <Image
                src="/esports-arena.jpeg"
                alt="E-Sports Arena"
                width={300}
                height={200}
                className="rounded-2xl shadow-2xl shadow-neon-orange/25 border-2 border-neon-orange/30 group-hover:border-neon-orange transition-all duration-300 animate-neon-border"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-50/80 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                <span className="text-neon-orange font-bold">E-Sports Arena</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center animate-slide-up" style={{animationDelay: '0.4s'}}>
          {isConnected ? (
            <div className="flex flex-col sm:flex-row gap-8">
              <Link 
                href="/marketplace" 
                className="group relative overflow-hidden bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-pink text-white font-black py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-neon-blue/50 inline-flex items-center space-x-4 text-xl animate-energy-pulse border-2 border-neon-blue/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Gamepad2 className="w-8 h-8 relative z-10 animate-power-up" />
                <span className="relative z-10">ENTER ARENA</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform duration-200 animate-level-up" />
              </Link>
              <Link 
                href="/wallet" 
                className="group relative overflow-hidden bg-gradient-to-r from-dark-600 to-dark-800 hover:from-neon-green hover:to-neon-yellow text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-neon-green/50 inline-flex items-center space-x-4 text-xl border-2 border-neon-green/50 animate-glow"
              >
                <CreditCard className="w-8 h-8 animate-cyber-glitch" />
                <span>POWER WALLET</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-8 animate-pulse">
              <div className="transform scale-125 p-8 bg-gradient-to-r from-dark-600/50 to-gaming-600/50 backdrop-blur-sm rounded-3xl border-2 border-neon-blue/30 shadow-2xl shadow-neon-blue/25">
                <WalletConnection />
              </div>
              <p className="text-neon-green font-bold text-xl animate-cyber-glitch">
                🚀 CONNECT TO START YOUR GAMING JOURNEY! 🚀
              </p>
            </div>
          )}
        </div>

        {/* Epic Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto mt-16">
          <StatCard 
            icon={<TrendingUp className="w-8 h-8 animate-level-up" />}
            value="$2.4M"
            label="Total Power"
            color="text-neon-green"
            className="bg-gradient-to-br from-dark-600/50 to-dark-800/50 backdrop-blur-sm border-2 border-neon-green/30 animate-energy-pulse"
          />
          <StatCard 
            icon={<Users className="w-8 h-8 animate-power-up" />}
            value="15,432"
            label="Warriors"
            color="text-neon-blue"
            className="bg-gradient-to-br from-dark-600/50 to-dark-800/50 backdrop-blur-sm border-2 border-neon-blue/30 animate-energy-pulse"
          />
          <StatCard 
            icon={<Gamepad2 className="w-8 h-8 animate-game-bounce" />}
            value="48"
            label="Game Worlds"
            color="text-neon-purple"
            className="bg-gradient-to-br from-dark-600/50 to-dark-800/50 backdrop-blur-sm border-2 border-neon-purple/30 animate-energy-pulse"
          />
          <StatCard 
            icon={<Globe className="w-8 h-8 animate-float" />}
            value="23"
            label="Kingdoms"
            color="text-neon-orange"
            className="bg-gradient-to-br from-dark-600/50 to-dark-800/50 backdrop-blur-sm border-2 border-neon-orange/30 animate-energy-pulse"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-16 relative">
        <div className="text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-black text-white animate-neon-pulse">
            <span className="bg-gradient-to-r from-neon-yellow via-neon-orange to-neon-red bg-clip-text text-transparent">
              LEVEL UP YOUR GAME
            </span>
          </h2>
          <p className="text-2xl text-neon-blue max-w-3xl mx-auto font-bold">
            🎯 Next-gen blockchain gaming with <span className="text-neon-yellow animate-cyber-glitch">INSANE</span> features!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <FeatureCard
            icon={<CreditCard className="w-10 h-10 text-neon-blue animate-power-up" />}
            title="⚡ KRW LIGHTNING PAYMENTS"
            description="Ultra-fast, zero-volatility KRW transactions. Pay like a pro gamer - instant and precise!"
            color="blue"
            className="bg-gradient-to-br from-dark-600/70 to-dark-800/70 backdrop-blur-sm border-2 border-neon-blue/40 hover:border-neon-blue animate-hover-lift hover:shadow-2xl hover:shadow-neon-blue/30"
          />
          
          <FeatureCard
            icon={<Zap className="w-10 h-10 text-neon-yellow animate-level-up" />}
            title="🚀 QUANTUM SPEED"
            description="Blazing-fast settlements with microscopic fees. Perfect for rapid-fire gaming transactions!"
            color="yellow"
            className="bg-gradient-to-br from-dark-600/70 to-dark-800/70 backdrop-blur-sm border-2 border-neon-yellow/40 hover:border-neon-yellow animate-hover-lift hover:shadow-2xl hover:shadow-neon-yellow/30"
          />
          
          <FeatureCard
            icon={<Shield className="w-10 h-10 text-neon-green animate-energy-pulse" />}
            title="🛡️ FORTRESS SECURITY"
            description="Military-grade blockchain security. Your assets are safer than a boss's treasure vault!"
            color="green"
            className="bg-gradient-to-br from-dark-600/70 to-dark-800/70 backdrop-blur-sm border-2 border-neon-green/40 hover:border-neon-green animate-hover-lift hover:shadow-2xl hover:shadow-neon-green/30"
          />
          
          <FeatureCard
            icon={<Gamepad2 className="w-10 h-10 text-neon-purple animate-game-bounce" />}
            title="🎮 GAMER DNA"
            description="Built by gamers, for gamers. Features like item locking, durability, and epic rarity systems!"
            color="purple"
            className="bg-gradient-to-br from-dark-600/70 to-dark-800/70 backdrop-blur-sm border-2 border-neon-purple/40 hover:border-neon-purple animate-hover-lift hover:shadow-2xl hover:shadow-neon-purple/30"
          />
          
          <FeatureCard
            icon={<Users className="w-10 h-10 text-neon-pink animate-cyber-glitch" />}
            title="💰 DEV REWARDS"
            description="Game developers earn from every epic transaction. Built-in royalty system that pays!"
            color="pink"
            className="bg-gradient-to-br from-dark-600/70 to-dark-800/70 backdrop-blur-sm border-2 border-neon-pink/40 hover:border-neon-pink animate-hover-lift hover:shadow-2xl hover:shadow-neon-pink/30"
          />
          
          <FeatureCard
            icon={<Target className="w-10 h-10 text-neon-orange animate-rotate-slow" />}
            title="🌍 GLOBAL DOMINATION"
            description="Conquer international markets with seamless cross-border payments and currency magic!"
            color="orange"
            className="bg-gradient-to-br from-dark-600/70 to-dark-800/70 backdrop-blur-sm border-2 border-neon-orange/40 hover:border-neon-orange animate-hover-lift hover:shadow-2xl hover:shadow-neon-orange/30"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-r from-dark-600/50 via-gaming-600/50 to-dark-600/50 backdrop-blur-sm rounded-3xl p-12 md:p-16 border-2 border-neon-blue/20 shadow-2xl shadow-neon-blue/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-transparent to-neon-purple/5 animate-gradient-x"></div>
        
        <div className="text-center space-y-12 relative z-10">
          <h2 className="text-5xl font-black text-white animate-neon-pulse">
            <span className="bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
              GAME PLAN
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6 group animate-slide-up">
              <div className="w-24 h-24 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-neon-blue/30 animate-energy-pulse group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-black text-3xl">1</span>
              </div>
              <h3 className="text-2xl font-bold text-neon-blue">🔗 POWER UP</h3>
              <p className="text-white font-medium text-lg">
                Connect your wallet and fuel up with KRW stablecoin to enter the arena!
              </p>
            </div>
            
            <div className="space-y-6 group animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-24 h-24 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-neon-purple/30 animate-energy-pulse group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-black text-3xl">2</span>
              </div>
              <h3 className="text-2xl font-bold text-neon-purple">🛒 HUNT & COLLECT</h3>
              <p className="text-white font-medium text-lg">
                Explore legendary items across multiple game worlds and collect with stable pricing!
              </p>
            </div>
            
            <div className="space-y-6 group animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="w-24 h-24 bg-gradient-to-r from-neon-green to-neon-yellow rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-neon-green/30 animate-energy-pulse group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-black text-3xl">3</span>
              </div>
              <h3 className="text-2xl font-bold text-neon-green">⚔️ DOMINATE</h3>
              <p className="text-white font-medium text-lg">
                Your items appear instantly in supported games with full ownership powers!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Epic CTA Section */}
      <section className="text-center space-y-12 py-20 relative">
        <div className="space-y-8">
          <h2 className="text-6xl md:text-7xl font-black text-white animate-neon-pulse">
            <span className="bg-gradient-to-r from-neon-red via-neon-orange to-neon-yellow bg-clip-text text-transparent">
              READY TO DOMINATE?
            </span>
          </h2>
          <p className="text-2xl text-neon-blue max-w-3xl mx-auto font-bold animate-cyber-glitch">
            Join the <span className="text-neon-yellow">ELITE</span> gaming community! 
            <br />🔥 <span className="text-neon-red">15,432+</span> warriors already gaming with KRW power! 🔥
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <Link 
            href="/marketplace" 
            className="group relative overflow-hidden bg-gradient-to-r from-neon-red via-neon-orange to-neon-yellow hover:from-neon-yellow hover:to-neon-red text-white font-black py-6 px-16 rounded-3xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-neon-orange/50 inline-flex items-center space-x-4 text-2xl animate-energy-pulse border-4 border-neon-orange/50"
          >
            <span className="animate-power-up">🚀 START GAMING</span>
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-200 animate-level-up" />
          </Link>
          <Link 
            href="/developers" 
            className="group relative overflow-hidden bg-gradient-to-r from-dark-600 to-dark-800 hover:from-neon-purple hover:to-neon-blue text-white font-bold py-6 px-16 rounded-3xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-neon-purple/50 inline-flex items-center space-x-4 text-2xl border-4 border-neon-purple/50 animate-glow"
          >
            <span>⚡ FOR DEVS</span>
          </Link>
        </div>
      </section>
    </div>
  );
}