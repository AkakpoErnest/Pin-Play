'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  color: string;
  className?: string;
}

export default function StatCard({ icon, value, label, color, className }: StatCardProps) {
  return (
    <div className="relative group">
      {/* Epic Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/30 to-neon-purple/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-energy-pulse"></div>
      
      {/* Gaming Card */}
      <div className={`relative rounded-2xl p-8 shadow-2xl transition-all duration-300 group-hover:scale-110 backdrop-blur-sm overflow-hidden ${className || 'bg-gradient-to-br from-dark-700/80 to-dark-900/80 border-2 border-neon-blue/30'}`}>
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-4">
            <div className={`${color} font-black text-4xl md:text-5xl group-hover:scale-125 transition-transform duration-300 animate-level-up drop-shadow-lg`}>
              {value}
            </div>
            <div className="text-white font-bold text-lg uppercase tracking-wider animate-cyber-glitch">
              {label}
            </div>
          </div>
          <div className={`${color} opacity-80 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-12`}>
            {icon}
          </div>
        </div>
        
        {/* Animated Gaming Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue/80 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-t from-transparent via-neon-purple/80 to-transparent translate-y-[100%] group-hover:translate-y-[-100%] transition-transform duration-700"></div>
        
        {/* Corner accents */}
        <div className="absolute top-2 right-2 w-3 h-3 bg-neon-yellow rounded-full opacity-0 group-hover:opacity-100 animate-game-bounce transition-opacity duration-300"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-neon-green rounded-full opacity-0 group-hover:opacity-100 animate-float transition-opacity duration-300" style={{animationDelay: '0.3s'}}></div>
      </div>
    </div>
  );
}
