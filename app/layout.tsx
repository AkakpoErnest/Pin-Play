'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { hardhat, sepolia, mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { injectedWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/Toaster';
import { WalletProvider } from '@/components/WalletProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

// Configure chains & providers - including mainnet for better compatibility
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia, hardhat],
  [publicProvider()]
);

// Set up connectors - simplified approach for better MetaMask compatibility
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ 
        chains,
        shimDisconnect: true,
      }),
      metaMaskWallet({ 
        chains,
        projectId: 'demo', // Minimal project ID to avoid WalletConnect issues
        shimDisconnect: true,
      }),
    ],
  },
]);

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// Create query client
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Handle Chrome extension API errors globally
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('chrome.runtime.sendMessage') || 
          event.error?.message?.includes('Extension ID')) {
        // Suppress Chrome extension related errors
        event.preventDefault();
        console.warn('Chrome extension API error suppressed:', event.error.message);
        return true;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('chrome.runtime.sendMessage') || 
          event.reason?.message?.includes('Extension ID')) {
        // Suppress Chrome extension related promise rejections
        event.preventDefault();
        console.warn('Chrome extension promise rejection suppressed:', event.reason.message);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>KRW Game Credits - Blockchain Gaming Payments</title>
        <meta name="description" content="Frictionless NFT & in-game purchase ecosystem powered by KRW stablecoin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <WagmiConfig config={config}>
              <RainbowKitProvider chains={chains}>
                <WalletProvider>
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1 container mx-auto px-4 py-8">
                      {children}
                    </main>
                  <footer className="bg-gray-900 text-white py-8 mt-auto">
                    <div className="container mx-auto px-4 text-center">
                      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">₩</span>
                          </div>
                          <span className="font-semibold">KRW Game Credits</span>
                        </div>
                        <p className="text-gray-400">
                          Bridging finance and gaming with blockchain technology
                        </p>
                      </div>
                      <div className="mt-6 pt-6 border-t border-gray-700 text-sm text-gray-500">
                        <p>© 2024 KRW Game Credits. Built for the Korea Stablecoin Hackathon.</p>
                      </div>
                    </div>
                  </footer>
                </div>
                <Toaster />
                </WalletProvider>
              </RainbowKitProvider>
            </WagmiConfig>
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
