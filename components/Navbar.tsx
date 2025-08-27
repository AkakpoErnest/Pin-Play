'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  Menu, 
  X, 
  Gamepad2, 
  CreditCard, 
  Code, 
  Home,
  ShoppingBag
} from 'lucide-react';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { name: 'Wallet', href: '/wallet', icon: CreditCard },
  { name: 'Developers', href: '/developers', icon: Code },
  { name: 'Demo Game', href: '/demo', icon: Gamepad2 },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-gradient-to-r from-white/90 via-white/95 to-white/90 backdrop-blur-xl shadow-xl sticky top-0 z-50 border-b border-gaming-200/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-gaming-600 via-gaming-500 to-neon-purple rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-gaming-500/25">
                <span className="text-white font-bold text-xl animate-pulse">₩</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-gaming-400 to-gaming-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-gaming-700 to-gaming-900 bg-clip-text text-transparent leading-none group-hover:from-gaming-600 group-hover:to-gaming-800 transition-all duration-300">
                KRW Game Credits
              </span>
              <span className="text-xs text-gaming-600 leading-none font-medium uppercase tracking-wider">
                🎮 Blockchain Gaming Payments
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Wallet Connect & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <ConnectButton 
                chainStatus="icon"
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
              />
            </div>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200',
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Connect Button */}
              <div className="px-4 py-2 sm:hidden">
                <ConnectButton 
                  chainStatus="icon"
                  accountStatus="avatar"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
