import React from 'react';
import { AlertCircle, Clock, ShieldX } from 'lucide-react';

interface RateLimitBannerProps {
  remaining: number;
  limit: number;
  resetTimestamp?: number;
}

export const RateLimitBanner: React.FC<RateLimitBannerProps> = ({
  remaining,
  limit,
  resetTimestamp,
}) => {
  if (remaining > 0) return null;

  const resetTimeStr = resetTimestamp
    ? new Date(resetTimestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    : '00:00 UTC';

  return (
    <div
      id="rate-limit-reached-banner"
      className="max-w-2xl mx-auto rounded-2xl bg-amber-50 border border-amber-200 p-6 sm:p-8 text-center shadow-sm animate-in fade-in duration-200"
    >
      <div className="mx-auto w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-3">
        <ShieldX className="w-6 h-6 stroke-[2]" />
      </div>

      <h3 className="text-xl font-bold text-amber-950 font-display">
        Daily Limit Reached
      </h3>

      <p className="mt-1.5 text-sm text-amber-900 max-w-md mx-auto">
        You have reached your daily limit of <strong className="font-semibold">{limit} free checks</strong>. Free checks reset daily at midnight.
      </p>

      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 border border-amber-200 text-xs font-medium text-amber-800">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>Resets at: {resetTimeStr}</span>
      </div>

      <div className="mt-5 text-xs text-amber-800/80">
        Please try again tomorrow or contact us if your enterprise requires elevated API capacity.
      </div>
    </div>
  );
};
