import React from 'react';
import { CourierStats } from '../types/index';
import { CourierCard } from './CourierCard';
import { Building2 } from 'lucide-react';

interface CourierGridProps {
  couriers: CourierStats[];
}

export const CourierGrid: React.FC<CourierGridProps> = ({ couriers }) => {
  if (!couriers || couriers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-display">
            Courier Performance Breakdown
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {couriers.length} {couriers.length === 1 ? 'Courier Network' : 'Courier Networks'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {couriers.map((courier) => (
          <CourierCard key={courier.id} courier={courier} />
        ))}
      </div>
    </div>
  );
};
