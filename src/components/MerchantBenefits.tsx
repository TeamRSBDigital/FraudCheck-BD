import React from 'react';
import { ShieldCheck, Truck, AlertTriangle, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { CourierLogo } from './CourierLogos';

interface MerchantBenefitsProps {
  onSelectSample: (phone: string) => void;
  disabled?: boolean;
}

export const MerchantBenefits: React.FC<MerchantBenefitsProps> = ({ onSelectSample, disabled }) => {
  const supportedCouriers = [
    { id: 'steadfast', name: 'SteadFast' },
    { id: 'pathao', name: 'Pathao' },
    { id: 'redx', name: 'RedX' },
    { id: 'paperfly', name: 'Paperfly' },
    { id: 'courierfast', name: 'Courier Fast' },
    { id: 'carrybee', name: 'CarryBee' },
  ];

  const sampleScenarios = [
    {
      phone: '01711111111',
      label: 'Verified Buyer',
      badge: '95% Success',
      color: 'border-emerald-200 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100/80',
      dot: 'bg-emerald-500',
    },
    {
      phone: '01922222222',
      label: 'Average Customer',
      badge: '65% Success',
      color: 'border-amber-200 bg-amber-50/80 text-amber-800 hover:bg-amber-100/80',
      dot: 'bg-amber-500',
    },
    {
      phone: '01833333333',
      label: 'High Return Risk',
      badge: '32% Success',
      color: 'border-rose-200 bg-rose-50/80 text-rose-800 hover:bg-rose-100/80',
      dot: 'bg-rose-500',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Quick Test Demo Scenarios */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Quick Test Demo Numbers (ক্লিক করে টেস্ট করুন)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Click any profile to run instant simulation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {sampleScenarios.map((sample) => (
            <button
              key={sample.phone}
              type="button"
              disabled={disabled}
              onClick={() => onSelectSample(sample.phone)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer active:scale-[0.98] ${sample.color} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${sample.dot}`} />
                <div>
                  <div className="font-semibold text-slate-900 font-mono">{sample.phone}</div>
                  <div className="text-[11px] opacity-80">{sample.label}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 font-semibold text-[11px]">
                <span>{sample.badge}</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3 Core Value Props for E-Commerce Merchants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3.5">
            <ShieldCheck className="w-5 h-5 stroke-[2]" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 font-display">
            Reduce Return Delivery Losses
          </h4>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Avoid paying 120-200 BDT in courier return fees by identifying serial returners and fake orders before dispatching.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-3.5">
            <Truck className="w-5 h-5 stroke-[2]" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 font-display">
            Unified Bangladesh Logistics
          </h4>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Consolidated order metrics and delivery completion ratios across SteadFast, Pathao, RedX, Paperfly, and more.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-3.5">
            <AlertTriangle className="w-5 h-5 stroke-[2]" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 font-display">
            Smart Advance Fee Advice
          </h4>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Get automated guidelines on whether to dispatch on standard COD or request advance delivery charges via bKash/Nagad.
          </p>
        </div>
      </div>

      {/* Supported Couriers Strip with Real Logos */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="text-center mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Supported Logistics Partners across Bangladesh
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {supportedCouriers.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-center h-10 w-28 sm:w-32 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
            >
              <CourierLogo id={c.id} name={c.name} className="max-h-6 w-auto max-w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
