'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/Toaster';

const inter = Inter({ subsets: ['latin'] });

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [hardhat, sepolia],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo' }),
    publicProvider(),
  ]
);

// Set up connectors
const { connectors } = getDefaultWallets({
  appName: 'KRW Game Credits',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo',
  chains,
});

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
  return (
    <html lang="en">
      <head>
        <title>KRW Game Credits - Blockchain Gaming Payments</title>
        <meta name="description" content="Frictionless NFT & in-game purchase ecosystem powered by KRW stablecoin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-50 to-blue-50`}>
        <QueryClientProvider client={queryClient}>
          <WagmiConfig config={config}>
            <RainbowKitProvider chains={chains}>
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
            </RainbowKitProvider>
          </WagmiConfig>
        </QueryClientProvider>
      </body>
    </html>
  );
}
