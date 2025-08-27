'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'indigo' | 'pink' | 'orange';
  className?: string;
}

const colorVariants = {
  blue: 'hover:border-blue-300 hover:shadow-blue-100',
  green: 'hover:border-green-300 hover:shadow-green-100',
  purple: 'hover:border-purple-300 hover:shadow-purple-100',
  yellow: 'hover:border-yellow-300 hover:shadow-yellow-100',
  indigo: 'hover:border-indigo-300 hover:shadow-indigo-100',
  pink: 'hover:border-pink-300 hover:shadow-pink-100',
};

export default function FeatureCard({ icon, title, description, color, className }: FeatureCardProps) {
  return (
    <div className={clsx(
      'group cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105',
      className || 'card',
      colorVariants[color]
    )}>
      <div className="p-8 space-y-6 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-white group-hover:animate-neon-pulse transition-all duration-300">
            {title}
          </h3>
        </div>
        
        <p className="text-gray-300 leading-relaxed text-lg font-medium group-hover:text-white transition-colors duration-300">
          {description}
        </p>
      </div>
      
      {/* Gaming card effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
    </div>
  );
}
