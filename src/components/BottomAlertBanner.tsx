import React from 'react';
import { AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';
import { RiskAssessment } from '../types/index';

interface BottomAlertBannerProps {
  risk: RiskAssessment;
  successRate: number;
}

export const BottomAlertBanner: React.FC<BottomAlertBannerProps> = ({
  risk,
  successRate,
}) => {
  const isHighRisk = risk.level === 'HIGH RISK';
  const isSafe = risk.level === 'LOW RISK';

  if (isSafe) {
    return (
      <div className="rounded-2xl p-5 sm:p-6 bg-emerald-50 border border-emerald-200 shadow-xs flex items-start gap-3.5">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 stroke-[2]" />
        <div>
          <h4 className="text-sm font-bold text-emerald-950 font-display">
            High Success Rate: {successRate}%
          </h4>
          <p className="mt-1 text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
            This customer has a clean delivery track record across partner courier networks. Safe for standard Cash-on-Delivery dispatch.
          </p>
        </div>
      </div>
    );
  }

  if (isHighRisk) {
    return (
      <div className="rounded-2xl p-5 sm:p-6 bg-rose-50 border border-rose-200 shadow-xs flex items-start gap-3.5">
        <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 stroke-[2]" />
        <div>
          <h4 className="text-sm font-bold text-rose-950 font-display">
            High Return Risk: {successRate}% Success Rate
          </h4>
          <p className="mt-1 text-xs sm:text-sm text-rose-950 leading-relaxed font-medium">
            This phone number has a high proportion of returned parcels. Collect advance delivery charges before booking with couriers.
          </p>
        </div>
      </div>
    );
  }

  // Moderate
  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-amber-50 border border-amber-200 shadow-xs flex items-start gap-3.5">
      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 stroke-[2]" />
      <div>
        <h4 className="text-sm font-bold text-amber-950 font-display">
          Moderate Success Rate: {successRate}%
        </h4>
        <p className="mt-1 text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
          This phone number has a notable number of failed/cancelled orders. Please communicate with the customer before dispatch.
        </p>
      </div>
    </div>
  );
};
