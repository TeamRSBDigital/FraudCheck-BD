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
  // B2B status indicators based on merchant success thresholds
  const isHighSuccess = successRate >= 80;
  const isModerateSuccess = successRate >= 60 && successRate < 80;

  const rateColorClass = isHighSuccess
    ? 'text-emerald-600'
    : isModerateSuccess
    ? 'text-amber-600'
    : 'text-rose-600';

  const rateBarClass = isHighSuccess
    ? 'bg-emerald-600'
    : isModerateSuccess
    ? 'bg-amber-500'
    : 'bg-rose-600';

  const rateBgClass = isHighSuccess
    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
    : isModerateSuccess
    ? 'bg-amber-50 text-amber-700 border-amber-100'
    : 'bg-rose-50 text-rose-700 border-rose-100';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" id="metric-cards-grid">
      {/* 1. Total Orders */}
      <div className="rounded-2xl p-5 sm:p-6 bg-white border border-slate-200 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Orders
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight block">
            {totalOrders}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-0.5 block">
            Recorded shipments
          </span>
        </div>
      </div>

      {/* 2. Successful */}
      <div className="rounded-2xl p-5 sm:p-6 bg-white border border-slate-200 shadow-xs flex flex-col justify-between transition-all hover:border-emerald-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Successful
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono tracking-tight block">
            {delivered}
          </span>
          <span className="text-xs text-emerald-600 font-medium mt-0.5 block">
            Accepted parcels
          </span>
        </div>
      </div>

      {/* 3. Cancelled */}
      <div className="rounded-2xl p-5 sm:p-6 bg-white border border-slate-200 shadow-xs flex flex-col justify-between transition-all hover:border-rose-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Cancelled
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono tracking-tight block">
            {cancelled}
          </span>
          <span className="text-xs text-rose-600 font-medium mt-0.5 block">
            Failed / Returned
          </span>
        </div>
      </div>

      {/* 4. Success Rate */}
      <div className="rounded-2xl p-5 sm:p-6 bg-white border border-slate-200 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Success Rate
          </span>
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${rateBgClass}`}>
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight block ${rateColorClass}`}>
            {successRate}%
          </span>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${rateBarClass}`}
              style={{ width: `${Math.min(100, Math.max(0, successRate))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

