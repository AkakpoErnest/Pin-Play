'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { 
  Gamepad2, 
  Sword, 
  Shield, 
  Heart, 
  Star,
  Zap,
  Package,
  ShoppingCart,
  Trophy,
  Play,
  Pause
} from 'lucide-react';
import WalletConnection from '@/components/WalletConnection';
import { toast } from '@/components/ui/Toaster';

// Mock player data
const mockPlayer = {
  name: "Player",
  level: 15,
  health: 85,
  maxHealth: 100,
  mana: 60,
  maxMana: 80,
  experience: 1250,
  nextLevelExp: 1500,
  gold: 2500,
  inventory: [
    { id: 1, name: "Health Potion", quantity: 3, type: "consumable" },
    { id: 2, name: "Iron Sword", quantity: 1, type: "weapon", equipped: true },
    { id: 3, name: "Leather Armor", quantity: 1, type: "armor", equipped: true },
  ]
};

// Game items available for purchase
const gameShopItems = [
  {
    id: 1,
    name: "Legendary Dragon Sword",
    description: "A powerful sword forged from dragon scales",
    price: "25000",
    type: "weapon",
    rarity: 5,
    stats: { attack: 150, durability: 100 },
    image: "🗡️"
  },
  {
    id: 2,
    name: "Mystic Shield of Valor",
    description: "Provides excellent protection in battle",
    price: "15000", 
    type: "armor",
    rarity: 4,
    stats: { defense: 120, durability: 100 },
    image: "🛡️"
  },
  {
    id: 3,
    name: "Health Potion Pack",
    description: "Restores 50 HP instantly (Pack of 5)",
    price: "2500",
    type: "consumable",
    rarity: 1,
    stats: { healing: 50, quantity: 5 },
    image: "🧪"
  },
  {
    id: 4,
    name: "Elite Armor Set",
    description: "Complete armor set for maximum protection",
    price: "40000",
    type: "armor", 
    rarity: 4,
    stats: { defense: 200, durability: 100 },
    image: "👘"
  }
];

const rarityColors = {
  1: "text-gray-600",
  2: "text-green-600", 
  3: "text-blue-600",
  4: "text-purple-600",
  5: "text-yellow-600"
};

export default function DemoGamePage() {
  const { isConnected } = useAccount();
  const [player, setPlayer] = useState(mockPlayer);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [balance] = useState("127500"); // Mock KRWGC balance
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock game loop
  useEffect(() => {
    if (!isGameRunning) return;

    const interval = setInterval(() => {
      setPlayer(prev => ({
        ...prev,
        experience: Math.min(prev.experience + 10, prev.nextLevelExp),
        gold: prev.gold + Math.floor(Math.random() * 50) + 10
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isGameRunning]);

  const handlePurchase = async (item: any) => {
    if (!isConnected) {
      toast.error('Wallet Required', 'Please connect your wallet to make purchases');
      return;
    }

    if (parseInt(balance) < parseInt(item.price)) {
      toast.error('Insufficient Balance', 'You need more KRWGC to purchase this item');
      return;
    }

    try {
      toast.info('Processing Purchase', 'Confirming transaction...');
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add item to inventory
      const newItem = {
        id: Date.now(),
        name: item.name,
        quantity: item.stats.quantity || 1,
        type: item.type,
        equipped: false
      };

      setPlayer(prev => ({
        ...prev,
        inventory: [...prev.inventory, newItem]
      }));
      
      toast.success('Purchase Successful!', `${item.name} has been added to your inventory`);
      setSelectedItem(null);
    } catch (error) {
      toast.error('Purchase Failed', 'Please try again');
    }
  };

  const equipItem = (item: any) => {
    setPlayer(prev => ({
      ...prev,
      inventory: prev.inventory.map(invItem => 
        invItem.id === item.id 
          ? { ...invItem, equipped: !invItem.equipped }
          : invItem.type === item.type 
            ? { ...invItem, equipped: false }
            : invItem
      )
    }));
    
    toast.success('Item Updated', `${item.name} ${item.equipped ? 'unequipped' : 'equipped'}`);
  };

  const useItem = (item: any) => {
    if (item.type === 'consumable') {
      setPlayer(prev => ({
        ...prev,
        health: Math.min(prev.health + 50, prev.maxHealth),
        inventory: prev.inventory.map(invItem =>
          invItem.id === item.id
            ? { ...invItem, quantity: invItem.quantity - 1 }
            : invItem
        ).filter(invItem => invItem.quantity > 0)
      }));
      
      toast.success('Item Used', 'Health restored!');
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
          <Gamepad2 className="w-24 h-24 text-gray-400 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900">Demo RPG Game</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience blockchain-powered gaming with KRW Game Credits. Connect your wallet to start playing!
          </p>
        </div>
        <WalletConnection />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold heading-gradient flex items-center justify-center space-x-3">
          <Gamepad2 className="w-10 h-10" />
          <span>Demo RPG Game</span>
        </h1>
        <p className="text-xl text-gray-600">
          A simple RPG showcasing KRW Game Credits integration
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Game Area */}
        <div className="xl:col-span-2 space-y-6">
          {/* Player Stats */}
          <div className="card">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <span>{player.name} (Level {player.level})</span>
                </h2>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Balance: <span className="font-bold text-blue-600">{parseInt(balance).toLocaleString()} KRWGC</span>
                  </div>
                  <button
                    onClick={() => setIsGameRunning(!isGameRunning)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isGameRunning 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {isGameRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isGameRunning ? 'Pause' : 'Start'} Game</span>
                  </button>
                </div>
              </div>

              {/* Health and Mana Bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>Health</span>
                    </span>
                    <span className="text-sm text-gray-600">{player.health}/{player.maxHealth}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-red-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span>Mana</span>
                    </span>
                    <span className="text-sm text-gray-600">{player.mana}/{player.maxMana}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(player.mana / player.maxMana) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Experience Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Experience</span>
                  <span className="text-sm text-gray-600">{player.experience}/{player.nextLevelExp}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(player.experience / player.nextLevelExp) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Gold */}
              <div className="flex items-center justify-center p-4 bg-yellow-50 rounded-lg">
                <span className="text-lg font-bold text-yellow-700">
                  💰 {player.gold} Gold
                </span>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="card">
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Inventory</span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {player.inventory.map((item) => (
                  <div 
                    key={item.id}
                    className={`card p-4 text-center cursor-pointer transition-all duration-200 ${
                      item.equipped ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => item.type === 'consumable' ? useItem(item) : equipItem(item)}
                  >
                    <div className="space-y-2">
                      <div className="text-2xl">
                        {item.type === 'weapon' ? <Sword className="w-8 h-8 mx-auto text-red-500" /> :
                         item.type === 'armor' ? <Shield className="w-8 h-8 mx-auto text-blue-500" /> :
                         <Heart className="w-8 h-8 mx-auto text-green-500" />}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      {item.quantity > 1 && (
                        <div className="text-xs text-gray-600">x{item.quantity}</div>
                      )}
                      {item.equipped && (
                        <div className="text-xs text-blue-600 font-medium">Equipped</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Game Shop */}
        <div className="space-y-6">
          <div className="card">
            <div className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Game Shop</span>
              </h3>
              
              <div className="space-y-4">
                {gameShopItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="text-3xl">{item.image}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <div className="flex space-x-1">
                            {Array.from({ length: item.rarity }, (_, i) => (
                              <Star key={i} className={`w-3 h-3 fill-current ${rarityColors[item.rarity as keyof typeof rarityColors]}`} />
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600">{item.description}</p>
                        
                        <div className="text-lg font-bold text-blue-600">
                          {parseInt(item.price).toLocaleString()} KRWGC
                        </div>
                        
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="w-full btn-primary text-sm py-2"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <div className="p-6 space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl">{selectedItem.image}</div>
                <h3 className="text-xl font-bold text-gray-900">{selectedItem.name}</h3>
                <p className="text-gray-600">{selectedItem.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Price:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {parseInt(selectedItem.price).toLocaleString()} KRWGC
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Your Balance:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {parseInt(balance).toLocaleString()} KRWGC
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePurchase(selectedItem)}
                  disabled={parseInt(balance) < parseInt(selectedItem.price)}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
