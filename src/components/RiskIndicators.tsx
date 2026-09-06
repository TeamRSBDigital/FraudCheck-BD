import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, Shield } from 'lucide-react';
import { RiskIndicator } from '../types/index';

interface RiskIndicatorsProps {
  indicators: RiskIndicator[];
}

export const RiskIndicators: React.FC<RiskIndicatorsProps> = ({ indicators }) => {
  if (!indicators || indicators.length === 0) return null;

  const getIndicatorStyle = (type: RiskIndicator['type']) => {
    switch (type) {
      case 'positive':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
          bgColor: 'bg-emerald-50/50 border-emerald-100',
          titleColor: 'text-emerald-900',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
          bgColor: 'bg-amber-50/50 border-amber-100',
          titleColor: 'text-amber-900',
        };
      case 'negative':
        return {
          icon: <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
          bgColor: 'bg-rose-50/50 border-rose-100',
          titleColor: 'text-rose-900',
        };
      default:
        return {
          icon: <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />,
          bgColor: 'bg-slate-50/70 border-slate-200/80',
          titleColor: 'text-slate-900',
        };
    }
  };

  return (
    <div className="rounded-xl bg-white p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-display">
            Delivery Risk Indicators
          </h3>
        </div>
        <span className="text-xs text-slate-500">
          Transparent Signal Breakdown
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {indicators.map((item, idx) => {
          const style = getIndicatorStyle(item.type);
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-lg border flex items-start gap-3 transition-colors ${style.bgColor}`}
            >
              {style.icon}
              <div className="space-y-0.5">
                <span className={`text-xs font-bold ${style.titleColor}`}>
                  {item.label}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
