import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Database, ShieldAlert } from 'lucide-react';

interface LoadingStateProps {
  phone?: string;
}

const STAGES = [
  {
    id: 1,
    name: 'Validating',
    label: 'Format & Prefix',
    description: 'Verifying Bangladeshi mobile operator and number structure',
    icon: Sparkles,
  },
  {
    id: 2,
    name: 'Checking',
    label: 'Courier Records',
    description: 'Connecting to courier databases (Pathao, SteadFast, RedX, CarryBee)',
    icon: Database,
  },
  {
    id: 3,
    name: 'Analyzing',
    label: 'Risk Calculation',
    description: 'Evaluating return velocity and generating merchant recommendations',
    icon: ShieldAlert,
  },
];

export const LoadingState: React.FC<LoadingStateProps> = ({ phone }) => {
  const [progress, setProgress] = useState<number>(12);

  useEffect(() => {
    // Smooth progress simulation moving through the stages
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) {
          // Rapid initial validation
          return prev + Math.random() * 4 + 2;
        } else if (prev < 72) {
          // Querying courier networks
          return prev + Math.random() * 3 + 1.2;
        } else if (prev < 94) {
          // Calculating risk metrics
          return prev + Math.random() * 1.5 + 0.4;
        }
        // Cap at 95% until real API completes
        return Math.min(95, prev + 0.1);
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  const roundedProgress = Math.min(98, Math.round(progress));

  // Determine current active stage
  let activeStageId = 1;
  if (roundedProgress >= 72) {
    activeStageId = 3;
  } else if (roundedProgress >= 30) {
    activeStageId = 2;
  }

  const currentStage = STAGES.find((s) => s.id === activeStageId) || STAGES[0];

  return (
    <div
      id="loading-state-card"
      className="rounded-2xl bg-white p-5 sm:p-7 border border-slate-200 shadow-xs animate-in fade-in duration-200 space-y-6"
    >
      {/* Loading Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                Checking Courier History
              </h3>
              {phone && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                  {phone}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Current stage:{' '}
              <span className="font-semibold text-slate-900">
                {currentStage.name}
              </span>{' '}
              — {currentStage.description}
            </p>
          </div>
        </div>

        {/* Progress Percentage Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Progress
          </span>
          <span className="font-mono text-base sm:text-lg font-extrabold text-slate-900 bg-slate-100 px-3 py-0.5 rounded-lg border border-slate-200">
            {roundedProgress}%
          </span>
        </div>
      </div>

      {/* Smooth Animated Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full rounded-full bg-slate-900 transition-all duration-150 ease-out relative overflow-hidden"
            style={{ width: `${roundedProgress}%` }}
          >
            {/* Subtle shimmering highlight on progress bar */}
            <div className="absolute inset-0 bg-white/20 w-full -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>

      {/* 3 Stage Step Indicators (Validating, Checking, Analyzing) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {STAGES.map((stg) => {
          const isCompleted = activeStageId > stg.id;
          const isCurrent = activeStageId === stg.id;
          const isUpcoming = activeStageId < stg.id;
          const IconComponent = stg.icon;

          return (
            <div
              key={stg.id}
              className={`p-3.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                isCurrent
                  ? 'bg-slate-50 border-slate-300 ring-1 ring-slate-300 shadow-2xs'
                  : isCompleted
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-slate-50/50 border-slate-200 opacity-60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                ) : (
                  <IconComponent className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isCurrent
                        ? 'text-slate-950'
                        : isCompleted
                        ? 'text-emerald-900'
                        : 'text-slate-500'
                    }`}
                  >
                    {stg.name}
                  </span>
                  {isCurrent && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-900 animate-ping" />
                  )}
                </div>
                <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                  {stg.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shimmer Skeleton Preview of the Results Layout */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        {/* Recommendation banner skeleton */}
        <div className="h-16 w-full rounded-2xl bg-slate-100/80 animate-pulse" />

        {/* 4 Metric cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="h-20 rounded-2xl bg-slate-100/80 animate-pulse" />
          <div className="h-20 rounded-2xl bg-slate-100/80 animate-pulse" />
          <div className="h-20 rounded-2xl bg-slate-100/80 animate-pulse" />
          <div className="h-20 rounded-2xl bg-slate-100/80 animate-pulse" />
        </div>

        {/* Table & Chart skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 h-48 rounded-2xl bg-slate-100/80 animate-pulse" />
          <div className="lg:col-span-5 h-48 rounded-2xl bg-slate-100/80 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
