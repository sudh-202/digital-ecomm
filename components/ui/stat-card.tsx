import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: string;
    timeframe: string;
  };
}

export function StatCard({ title, value, icon, change }: StatCardProps) {
  return (
    <div className="rounded-lg bg-[#1F2937] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{title}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="mt-2">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        {change && (
          <p className="mt-1 text-sm">
            <span className="text-green-500">+{change.value}</span>
            <span className="text-gray-400 ml-1">from {change.timeframe}</span>
          </p>
        )}
      </div>
    </div>
  );
}
