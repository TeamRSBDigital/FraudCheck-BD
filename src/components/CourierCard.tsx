import React from 'react';
import { CourierStats } from '../types/index';
import { Truck } from 'lucide-react';

interface CourierCardProps {
  courier: CourierStats;
}

// Brand color themes for recognizable Bangladeshi couriers
const BRAND_STYLES: Record<string, { badge: string; accent: string }> = {
  steadfast: { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', accent: 'bg-emerald-600' },
  pathao: { badge: 'bg-red-50 text-red-800 border-red-200', accent: 'bg-red-600' },
  redx: { badge: 'bg-orange-50 text-orange-800 border-orange-200', accent: 'bg-orange-600' },
  paperfly: { badge: 'bg-blue-50 text-blue-800 border-blue-200', accent: 'bg-blue-600' },
  courierfast: { badge: 'bg-purple-50 text-purple-800 border-purple-200', accent: 'bg-purple-600' },
  carrybee: { badge: 'bg-amber-50 text-amber-800 border-amber-200', accent: 'bg-amber-600' },
};

export const CourierCard: React.FC<CourierCardProps> = ({ courier }) => {
  const brand = BRAND_STYLES[courier.id] || {
    badge: 'bg-slate-100 text-slate-800 border-slate-200',
    accent: 'bg-slate-800',
  };

  return (
    <div className="rounded-xl bg-white p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Truck className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-slate-900 font-display">
              {courier.name}
            </h4>
          </div>

          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${brand.badge}`}>
            {courier.successRate}% Success
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 py-3.5">
          <div className="bg-slate-50/70 p-2.5 rounded-lg">
            <span className="text-[11px] font-medium text-slate-500 uppercase block">Orders</span>
            <span className="text-lg font-bold font-mono text-slate-900">{courier.totalOrders}</span>
          </div>

          <div className="bg-emerald-50/40 p-2.5 rounded-lg">
            <span className="text-[11px] font-medium text-emerald-800 uppercase block">Delivered</span>
            <span className="text-lg font-bold font-mono text-emerald-700">{courier.delivered}</span>
          </div>

          <div className="bg-rose-50/40 p-2.5 rounded-lg">
            <span className="text-[11px] font-medium text-rose-800 uppercase block">Returned</span>
            <span className="text-lg font-bold font-mono text-rose-700">{courier.returned}</span>
          </div>

          <div className="bg-amber-50/40 p-2.5 rounded-lg">
            <span className="text-[11px] font-medium text-amber-800 uppercase block">Cancelled</span>
            <span className="text-lg font-bold font-mono text-amber-700">{courier.cancelled}</span>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="pt-2">
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              courier.successRate >= 80
                ? 'bg-emerald-500'
                : courier.successRate >= 60
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, courier.successRate))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
