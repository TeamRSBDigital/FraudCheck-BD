import React from 'react';
import { ShieldCheck, Truck, AlertTriangle } from 'lucide-react';
import { CourierLogo } from './CourierLogos';

export const MerchantBenefits: React.FC = () => {
  const supportedCouriers = [
    { id: 'steadfast', name: 'SteadFast' },
    { id: 'pathao', name: 'Pathao' },
    { id: 'redx', name: 'RedX' },
    { id: 'paperfly', name: 'Paperfly' },
    { id: 'courierfast', name: 'Courier Fast' },
    { id: 'carrybee', name: 'CarryBee' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 3 Core Value Props with Colorful Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <div className="rounded-2xl border border-emerald-100/90 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 p-5 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-sm shadow-emerald-500/25 flex items-center justify-center text-white mb-3.5">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 font-display">
            Reduce Return Delivery Losses
          </h4>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Avoid paying 120-200 BDT in courier return fees by identifying serial returners and fake orders before dispatching.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100/90 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 p-5 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-sm shadow-blue-500/25 flex items-center justify-center text-white mb-3.5">
            <Truck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 font-display">
            Unified Bangladesh Logistics
          </h4>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Consolidated order metrics and delivery completion ratios across SteadFast, Pathao, RedX, Paperfly, and more.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100/90 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 p-5 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 shadow-sm shadow-amber-500/25 flex items-center justify-center text-white mb-3.5">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
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
      <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-50/70 via-white to-blue-50/40 p-4 sm:p-5 shadow-xs">
        <div className="text-center mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Supported Logistics Partners across Bangladesh
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {supportedCouriers.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-center h-10 w-28 sm:w-32 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-xs transition-all shadow-2xs"
            >
              <CourierLogo id={c.id} name={c.name} className="max-h-6 w-auto max-w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
