'use client';

import { useState } from 'react';
import { 
  ShoppingCart, 
  Star, 
  Sword, 
  Shield, 
  Heart, 
  Zap,
  Package,
  Eye
} from 'lucide-react';
import { clsx } from 'clsx';

interface GameItem {
  id: number;
  name: string;
  type: string;
  rarity: number;
  price: string;
  attack: number;
  defense: number;
  durability: number;
  game: string;
  image: string;
  seller: string;
  isListed: boolean;
}

interface GameItemCardProps {
  item: GameItem;
  onPurchase: () => void;
}

const rarityColors = {
  1: 'border-gray-400 bg-gray-50 text-gray-800',
  2: 'border-green-400 bg-green-50 text-green-800',
  3: 'border-blue-400 bg-blue-50 text-blue-800',
  4: 'border-purple-400 bg-purple-50 text-purple-800',
  5: 'border-yellow-400 bg-yellow-50 text-yellow-800',
};

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

export default function GameItemCard({ item, onPurchase }: GameItemCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      await onPurchase();
    } finally {
      setIsLoading(false);
    }
  };

  const TypeIcon = typeIcons[item.type] || Star;
  const rarityClass = rarityColors[item.rarity as keyof typeof rarityColors];
  const rarityName = rarityNames[item.rarity as keyof typeof rarityNames];

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat().format(parseInt(price));
  };

  return (
    <div className={clsx(
      'card group relative overflow-hidden',
      item.rarity === 5 && 'animate-glow'
    )}>
      {/* Rarity Badge */}
      <div className={clsx(
        'absolute top-3 left-3 z-10 px-2 py-1 rounded-full text-xs font-bold border',
        rarityClass
      )}>
        {rarityName}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full transition-all duration-300 hover:bg-opacity-100"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <TypeIcon className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600 capitalize">{item.type}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400 uppercase">{item.game}</span>
          </div>
          
          <h3 className="font-semibold text-lg text-gray-900 leading-tight">
            {item.name}
          </h3>
        </div>

        {/* Stats - Show on hover or when details are open */}
        {(showDetails || false) && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="font-semibold text-red-600">{item.attack}</div>
              <div className="text-gray-600">ATK</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-semibold text-blue-600">{item.defense}</div>
              <div className="text-gray-600">DEF</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-semibold text-green-600">{item.durability}</div>
              <div className="text-gray-600">DUR</div>
            </div>
          </div>
        )}

        {/* Price and Purchase */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Price</div>
              <div className="text-xl font-bold text-gray-900">
                {formatPrice(item.price)} 
                <span className="text-sm font-normal text-gray-600 ml-1">KRWGC</span>
              </div>
            </div>
            
            {/* Rarity Stars */}
            <div className="flex space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={clsx(
                    'w-4 h-4',
                    i < item.rarity
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={isLoading || !item.isListed}
            className={clsx(
              'w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200',
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : !item.isListed
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary hover:shadow-lg transform hover:scale-105 active:scale-95'
            )}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : !item.isListed ? (
              <>
                <span>Sold Out</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Buy Now</span>
              </>
            )}
          </button>
        </div>

        {/* Seller Info */}
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Seller: </span>
          <span className="font-mono">{item.seller}</span>
        </div>
      </div>
    </div>
  );
}
