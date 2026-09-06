import React from 'react';
import { Package, CheckCircle, RotateCcw, XCircle, TrendingUp, AlertOctagon } from 'lucide-react';
import { AggregatedCourierData } from '../types/index';

interface SummaryStatsProps {
  data: AggregatedCourierData;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ data }) => {
  const { totalOrders, delivered, cancelled, returned, successRate, returnRate } = data;

  return (
    <div className="space-y-4">
      {/* 4 Primary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Orders */}
        <div className="rounded-xl bg-white p-4 border border-slate-200/90 shadow-sm" id="stat-total-orders">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
            {totalOrders}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Recorded shipments</span>
        </div>

        {/* Delivered */}
        <div className="rounded-xl bg-white p-4 border border-emerald-100 shadow-sm bg-emerald-50/20" id="stat-delivered">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Delivered</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700">
            {delivered}
          </div>
          <span className="text-[11px] text-emerald-600/80 mt-0.5 block">Successfully accepted</span>
        </div>

        {/* Returned */}
        <div className="rounded-xl bg-white p-4 border border-rose-100 shadow-sm bg-rose-50/20" id="stat-returned">
          <div className="flex items-center justify-between text-rose-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Returned</span>
            <RotateCcw className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-700">
            {returned}
          </div>
          <span className="text-[11px] text-rose-600/80 mt-0.5 block">Sent back to merchant</span>
        </div>

        {/* Cancelled */}
        <div className="rounded-xl bg-white p-4 border border-amber-100 shadow-sm bg-amber-50/20" id="stat-cancelled">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cancelled</span>
            <XCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-700">
            {cancelled}
          </div>
          <span className="text-[11px] text-amber-600/80 mt-0.5 block">Voided before delivery</span>
        </div>
      </div>

      {/* Progress & Ratio Bars */}
      <div className="rounded-xl bg-white p-5 border border-slate-200/90 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Delivery Success Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Delivery Success Rate</span>
            </div>
            <span className="text-sm font-bold font-mono text-slate-900">
              {successRate}%
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                successRate >= 80
                  ? 'bg-emerald-500'
                  : successRate >= 60
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, successRate))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>0%</span>
            <span>Target: &gt;80%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Return Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              <span>Return Rate</span>
            </div>
            <span className="text-sm font-bold font-mono text-slate-900">
              {returnRate}%
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                returnRate <= 10
                  ? 'bg-emerald-500'
                  : returnRate <= 25
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, returnRate))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>0%</span>
            <span>Safe: &lt;15%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
