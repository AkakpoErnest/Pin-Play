'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SimpleWalletConnection from './SimpleWalletConnection';
import { 
  Menu, 
  X, 
  Gamepad2, 
  CreditCard, 
  Code, 
  Home,
  ShoppingBag,
  Zap,
  Trophy,
  Target
} from 'lucide-react';
import { clsx } from 'clsx';

const navigation = [
  { name: 'HOME', href: '/', icon: Home, color: 'neon-blue' },
  { name: 'ARENA', href: '/marketplace', icon: ShoppingBag, color: 'neon-purple' },
  { name: 'WALLET', href: '/wallet', icon: CreditCard, color: 'neon-green' },
  { name: 'DEVS', href: '/developers', icon: Code, color: 'neon-yellow' },
  { name: 'DEMO', href: '/demo', icon: Gamepad2, color: 'neon-orange' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-gradient-to-r from-dark-100/95 via-dark-50/95 to-dark-100/95 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b-2 border-neon-blue/30 animate-energy-pulse">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Epic Logo */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xl shadow-neon-blue/30 animate-neon-border border-2 border-neon-blue/50">
                <span className="text-white font-black text-2xl animate-power-up">₩</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue to-neon-purple rounded-2xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300 animate-energy-pulse"></div>
              
              {/* Floating particles */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-yellow rounded-full animate-game-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-neon-green rounded-full animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{animationDelay: '0.5s'}}></div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent leading-none group-hover:animate-neon-pulse transition-all duration-300">
                KRW GAME ARENA
              </span>
              <span className="text-sm text-neon-green leading-none font-bold uppercase tracking-wider animate-cyber-glitch">
                🚀 BLOCKCHAIN GAMING POWER 🚀
              </span>
            </div>
          </Link>

          {/* Epic Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'group relative flex items-center space-x-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 border-2 shadow-lg cursor-pointer',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/30 border-blue-500/50 text-white shadow-blue-500/30 animate-pulse'
                      : 'text-white hover:text-blue-400 border-transparent hover:border-blue-500/50 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-800/50 hover:shadow-blue-500/20'
                  )}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <Icon className={clsx(
                    "w-5 h-5 transition-all duration-300",
                    isActive ? "animate-level-up" : "group-hover:animate-power-up"
                  )} />
                  <span className="text-sm font-black tracking-wider">{item.name}</span>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-xl"></div>
                </Link>
              );
            })}
          </div>

          {/* Wallet Connect & Mobile Menu Button */}
          <div className="flex items-center space-x-6">
            <div className="hidden sm:block">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-green to-neon-blue rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-energy-pulse"></div>
                <div className="relative bg-gradient-to-r from-dark-600 to-dark-800 p-1 rounded-xl border-2 border-neon-green/50 hover:border-neon-green transition-all duration-300">
                  <SimpleWalletConnection />
                </div>
              </div>
            </div>
            
            {/* Epic Mobile menu button */}
            <button
              className="md:hidden p-3 rounded-xl bg-gradient-to-r from-dark-600 to-dark-800 text-neon-blue hover:text-neon-green border-2 border-neon-blue/50 hover:border-neon-green/50 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-neon-blue/20 animate-glow"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? 
                <X className="w-6 h-6 animate-cyber-glitch" /> : 
                <Menu className="w-6 h-6 animate-power-up" />
              }
            </button>
          </div>
        </div>

        {/* Epic Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t-2 border-neon-blue/30 py-6 bg-gradient-to-b from-dark-600/50 to-dark-800/50 backdrop-blur-sm rounded-b-2xl animate-slide-down">
            <div className="flex flex-col space-y-4">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      'group flex items-center space-x-4 px-6 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 border-2 shadow-lg animate-slide-up',
                      isActive
                        ? `bg-gradient-to-r from-${item.color}/20 to-${item.color}/30 border-${item.color}/50 text-white shadow-${item.color}/30`
                        : `text-white hover:text-${item.color} border-transparent hover:border-${item.color}/50 hover:bg-gradient-to-r hover:from-dark-700/50 hover:to-dark-900/50`
                    )}
                    style={{animationDelay: `${index * 0.1}s`}}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className={clsx(
                      "w-6 h-6 transition-all duration-300",
                      isActive ? "animate-level-up" : "group-hover:animate-power-up"
                    )} />
                    <span className="text-lg font-black tracking-wider">{item.name}</span>
                    
                    {/* Mobile hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-xl"></div>
                  </Link>
                );
              })}
              
              {/* Epic Mobile Connect Button */}
              <div className="px-6 py-4 sm:hidden">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-energy-pulse"></div>
                  <div className="relative bg-gradient-to-r from-dark-700 to-dark-900 p-2 rounded-xl border-2 border-neon-purple/50 hover:border-neon-purple transition-all duration-300">
                    <SimpleWalletConnection />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink animate-gradient-x"></div>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-blue rounded-full animate-float opacity-30"
            style={{
              left: `${i * 10}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 2)}s`
            }}
          />
        ))}
      </div>
    </nav>
  );
}