'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  color: string;
}

export default function StatCard({ icon, value, label, color }: StatCardProps) {
  return (
    <div className="relative group">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gaming-400/20 to-gaming-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Card */}
      <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl hover:border-gaming-300 transition-all duration-300 group-hover:scale-105 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className={`${color} font-bold text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-200 animate-slide-up`}>
              {value}
            </div>
            <div className="text-gray-700 font-semibold text-sm uppercase tracking-wider">
              {label}
            </div>
          </div>
          <div className={`${color} opacity-60 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110 group-hover:rotate-12`}>
            {icon}
          </div>
        </div>
        
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-gaming-400/0 via-gaming-600/50 to-gaming-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
}
