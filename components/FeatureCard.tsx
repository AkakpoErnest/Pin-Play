'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'indigo' | 'pink';
}

const colorVariants = {
  blue: 'hover:border-blue-300 hover:shadow-blue-100',
  green: 'hover:border-green-300 hover:shadow-green-100',
  purple: 'hover:border-purple-300 hover:shadow-purple-100',
  yellow: 'hover:border-yellow-300 hover:shadow-yellow-100',
  indigo: 'hover:border-indigo-300 hover:shadow-indigo-100',
  pink: 'hover:border-pink-300 hover:shadow-pink-100',
};

export default function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <div className={clsx(
      'card group cursor-pointer',
      colorVariants[color]
    )}>
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
            {title}
          </h3>
        </div>
        
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
