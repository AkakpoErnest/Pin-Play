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
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className={`${color} font-bold text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-200`}>
            {value}
          </div>
          <div className="text-gray-600 font-medium">
            {label}
          </div>
        </div>
        <div className={`${color} opacity-70 group-hover:opacity-100 transition-opacity duration-200`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
