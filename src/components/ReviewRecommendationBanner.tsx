import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Bookmark, Check, Printer, Sparkles } from 'lucide-react';
import { RiskAssessment } from '../types/index';

interface ReviewRecommendationBannerProps {
  risk: RiskAssessment;
  successRate: number;
  onPrint?: () => void;
  phone?: string;
}

export const ReviewRecommendationBanner: React.FC<ReviewRecommendationBannerProps> = ({
  risk,
  successRate,
  onPrint,
  phone,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const isHighRisk = risk.level === 'HIGH RISK';
  const isSafe = risk.level === 'LOW RISK';

  // Dynamic styling based on unified risk classification
  let containerBg = 'bg-gradient-to-r from-amber-50 to-orange-50/50 border-amber-200/90 text-amber-950';
  let badgeBg = 'bg-amber-500 text-white';
  let riskBadge = 'bg-amber-100 text-amber-800 border-amber-200';
  let title = 'Review Recommended';
  let subtitle = 'Confirm order details with customer over phone before dispatch';
  let bengaliAdvice = 'ডেলিভারি নিশ্চিত করার জন্য ফোনে কথা বলে অর্ডার কনফার্ম করুন';
  let bulletText = `Moderate delivery success rate (${successRate}%)`;
  let Icon = AlertTriangle;

  if (isHighRisk) {
    containerBg = 'bg-gradient-to-r from-rose-50 to-red-50/50 border-rose-200/90 text-rose-950';
    badgeBg = 'bg-rose-600 text-white';
    riskBadge = 'bg-rose-100 text-rose-800 border-rose-200';
    title = 'High Return Risk';
    subtitle = 'Significant parcel cancellation & return history across couriers';
    bengaliAdvice = 'সতর্কতা: রিটার্ন ঝুঁকি কমাতে অন্তত ডেলিভারি চার্জ অগ্রিম (bKash/Nagad) গ্রহণ করুন';
    bulletText = `Low delivery completion rate (${successRate}%) with elevated returns`;
    Icon = ShieldAlert;
  } else if (isSafe) {
    containerBg = 'bg-gradient-to-r from-emerald-50 to-teal-50/50 border-emerald-200/90 text-emerald-950';
    badgeBg = 'bg-emerald-600 text-white';
    riskBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    title = 'Safe to Dispatch';
    subtitle = 'Customer has strong delivery records. Safe for regular Cash-on-Delivery';
    bengaliAdvice = 'নিরাপদ: ক্যাশ অন ডেলিভারিতে নিশ্চিন্তে পার্সেল বুকিং করতে পারেন';
    bulletText = `High delivery success rate (${successRate}% delivered)`;
    Icon = ShieldCheck;
  }

  const handleSaveCustomer = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 border ${containerBg} shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${badgeBg} shadow-xs`}
        >
          <Icon className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-lg font-bold font-display tracking-tight text-slate-900">
              {title}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${riskBadge}`}>
              {risk.level}
            </span>
            {phone && (
              <span className="font-mono text-xs font-bold text-slate-600 px-2 py-0.5 rounded-md bg-white/80 border border-slate-200">
                {phone}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            {subtitle}
          </p>
          <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 pt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{bengaliAdvice}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
        {onPrint && (
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white text-xs font-bold text-slate-700 border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            title="Print Report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleSaveCustomer}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-white shadow-2xs hover:bg-slate-800 transition-colors cursor-pointer"
          id="save-customer-btn"
        >
          {isSaved ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save Buyer</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
