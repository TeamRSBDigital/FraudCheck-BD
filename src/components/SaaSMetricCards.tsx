import React from 'react';
import { Package, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

interface SaaSMetricCardsProps {
  totalOrders: number;
  delivered: number;
  cancelled: number;
  successRate: number;
}

export const SaaSMetricCards: React.FC<SaaSMetricCardsProps> = ({
  totalOrders,
  delivered,
  cancelled,
  successRate,
}) => {
  const isHighSuccess = successRate >= 80;
  const isModerateSuccess = successRate >= 60 && successRate < 80;

  const rateColorClass = isHighSuccess
    ? 'text-emerald-700'
    : isModerateSuccess
    ? 'text-amber-700'
    : 'text-rose-700';

  const rateBarClass = isHighSuccess
    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
    : isModerateSuccess
    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
    : 'bg-gradient-to-r from-rose-500 to-red-500';

  const rateBgClass = isHighSuccess
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : isModerateSuccess
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-rose-50 text-rose-700 border-rose-200';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" id="metric-cards-grid">
      {/* 1. Total Orders - Indigo Theme */}
      <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 border border-indigo-100/90 shadow-xs flex flex-col justify-between transition-all hover:shadow-md hover:border-indigo-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
            Total Orders
          </span>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight block">
            {totalOrders}
          </span>
          <span className="text-xs text-indigo-700 font-medium mt-0.5 block">
            Recorded shipments
          </span>
        </div>
      </div>

      {/* 2. Successful - Emerald Theme */}
      <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 border border-emerald-100/90 shadow-xs flex flex-col justify-between transition-all hover:shadow-md hover:border-emerald-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            Successful
          </span>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tracking-tight block">
            {delivered}
          </span>
          <span className="text-xs text-emerald-700 font-medium mt-0.5 block">
            Accepted parcels
          </span>
        </div>
      </div>

      {/* 3. Cancelled - Crimson Theme */}
      <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-rose-50/70 via-white to-red-50/50 border border-rose-100/90 shadow-xs flex flex-col justify-between transition-all hover:shadow-md hover:border-rose-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
            Cancelled
          </span>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white shadow-sm shadow-rose-500/20">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-mono tracking-tight block">
            {cancelled}
          </span>
          <span className="text-xs text-rose-700 font-medium mt-0.5 block">
            Failed / Returned
          </span>
        </div>
      </div>

      {/* 4. Success Rate - Amber/Teal Dynamic Theme */}
      <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 border border-amber-100/90 shadow-xs flex flex-col justify-between transition-all hover:shadow-md hover:border-amber-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Success Rate
          </span>
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-xs ${rateBgClass}`}>
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight block ${rateColorClass}`}>
            {successRate}%
          </span>
          <div className="w-full bg-slate-200/80 h-2.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out shadow-xs ${rateBarClass}`}
              style={{ width: `${Math.min(100, Math.max(0, successRate))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
