'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  Zap,
  Shield,
  Sword,
  Heart,
  Package
} from 'lucide-react';
import WalletConnection from '@/components/WalletConnection';
import GameItemCard from '@/components/GameItemCard';
import { toast } from '@/components/ui/Toaster';

// Mock data for demo - in real app this would come from blockchain
const mockItems = [
  {
    id: 0,
    name: "Legendary Dragon Sword",
    type: "sword",
    rarity: 5,
    price: "25000",
    attack: 150,
    defense: 20,
    durability: 100,
    game: "demo-rpg",
    image: "https://via.placeholder.com/300x300/DC2626/ffffff?text=🗡️",
    seller: "0x1234...5678",
    isListed: true
  },
  {
    id: 1,
    name: "Mystic Shield of Valor",
    type: "shield", 
    rarity: 4,
    price: "15000",
    attack: 10,
    defense: 120,
    durability: 100,
    game: "demo-rpg",
    image: "https://via.placeholder.com/300x300/7C3AED/ffffff?text=🛡️",
    seller: "0xabcd...efgh",
    isListed: true
  },
  {
    id: 2,
    name: "Health Potion",
    type: "potion",
    rarity: 1,
    price: "500",
    attack: 0,
    defense: 0,
    durability: 1,
    game: "demo-rpg",
    image: "https://via.placeholder.com/300x300/059669/ffffff?text=🧪",
    seller: "0x9999...1111",
    isListed: true
  },
  {
    id: 3,
    name: "Elite Armor Set",
    type: "armor",
    rarity: 4,
    price: "40000",
    attack: 30,
    defense: 200,
    durability: 100,
    game: "demo-rpg",
    image: "https://via.placeholder.com/300x300/1D4ED8/ffffff?text=👘",
    seller: "0x2222...3333",
    isListed: true
  },
  {
    id: 4,
    name: "Swift Bow",
    type: "bow",
    rarity: 3,
    price: "12000",
    attack: 100,
    defense: 5,
    durability: 100,
    game: "demo-rpg",
    image: "https://via.placeholder.com/300x300/EA580C/ffffff?text=🏹",
    seller: "0x4444...5555",
    isListed: true
  },
  {
    id: 5,
    name: "Magic Wand",
    type: "weapon",
    rarity: 3,
    price: "8000",
    attack: 80,
    defense: 0,
    durability: 100,
    game: "fantasy-quest",
    image: "https://via.placeholder.com/300x300/8B5CF6/ffffff?text=🪄",
    seller: "0x6666...7777",
    isListed: true
  }
];

const rarityNames = {
  1: "Common",
  2: "Uncommon", 
  3: "Rare",
  4: "Epic",
  5: "Legendary"
};

const typeIcons: Record<string, any> = {
  sword: Sword,
  shield: Shield,
  potion: Heart,
  armor: Package,
  bow: Zap,
  weapon: Star
};

export default function MarketplacePage() {
  const { isConnected } = useAccount();
  const [items, setItems] = useState(mockItems);
  const [filteredItems, setFilteredItems] = useState(mockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('price-low');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter and sort items
  useEffect(() => {
    let filtered = [...items];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.game.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rarity filter
    if (selectedRarity) {
      filtered = filtered.filter(item => item.rarity === selectedRarity);
    }

    // Type filter  
    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(item => parseInt(item.price) >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(item => parseInt(item.price) <= parseInt(priceRange.max));
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseInt(a.price) - parseInt(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseInt(b.price) - parseInt(a.price));
        break;
      case 'rarity':
        filtered.sort((a, b) => b.rarity - a.rarity);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedRarity, selectedType, priceRange, sortBy]);

  const handlePurchase = async (itemId: number) => {
    if (!isConnected) {
      toast.error('Wallet Required', 'Please connect your wallet to make purchases');
      return;
    }

    try {
      // Mock purchase - in real app would interact with smart contracts
      toast.info('Processing Purchase', 'Confirming transaction...');
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove item from marketplace
      setItems(prev => prev.filter(item => item.id !== itemId));
      
      toast.success('Purchase Successful!', 'Item has been added to your inventory');
    } catch (error) {
      toast.error('Purchase Failed', 'Please try again');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRarity(null);
    setSelectedType(null);
    setPriceRange({ min: '', max: '' });
    setSortBy('price-low');
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
          <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900">Game Marketplace</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect your wallet to browse and purchase game items with KRW stablecoin
          </p>
        </div>
        <WalletConnection />
      </div>
    );
  }

  const types = Array.from(new Set(items.map(item => item.type)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold heading-gradient">Game Marketplace</h1>
        <p className="text-xl text-gray-600">
          Discover and purchase game items with KRW stablecoin
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Rarity Filter */}
          <div>
            <select
              value={selectedRarity || ''}
              onChange={(e) => setSelectedRarity(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Rarities</option>
              {[1, 2, 3, 4, 5].map(rarity => (
                <option key={rarity} value={rarity}>
                  {rarityNames[rarity as keyof typeof rarityNames]}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value || null)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rarity">Rarity: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <button
              onClick={clearFilters}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Price Range */}
        <div className="mt-4 flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Price Range (KRWGC):</span>
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            className="w-24 py-1 px-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            className="w-24 py-1 px-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
        </p>
        
        {filteredItems.length > 0 && (
          <div className="text-sm text-gray-500">
            Showing results sorted by {sortBy.replace('-', ' ')}
          </div>
        )}
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <GameItemCard 
              key={item.id} 
              item={item} 
              onPurchase={() => handlePurchase(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-4">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900">No items found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={clearFilters}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
