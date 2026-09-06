import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { CheckerForm } from './components/CheckerForm';
import { LoadingState } from './components/LoadingState';
import { RiskScoreCard } from './components/RiskScoreCard';
import { SummaryStats } from './components/SummaryStats';
import { RiskIndicators } from './components/RiskIndicators';
import { CourierGrid } from './components/CourierGrid';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { RateLimitBanner } from './components/RateLimitBanner';
import { HowItWorksModal } from './components/HowItWorksModal';
import { AboutModal } from './components/AboutModal';
import { LegalModal } from './components/LegalModal';
import { Footer } from './components/Footer';
import { PhoneCheckResponse } from './types/index';
import { RotateCcw, Printer, HelpCircle, ShieldCheck, ArrowRight, Truck } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [report, setReport] = useState<PhoneCheckResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastQueriedPhone, setLastQueriedPhone] = useState<string>('');

  // Rate Limiting status
  const [remainingChecks, setRemainingChecks] = useState<number | null>(null);
  const [totalLimit, setTotalLimit] = useState<number>(50);
  const [resetTimestamp, setResetTimestamp] = useState<number | undefined>(undefined);

  // Modals
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  const checkerRef = useRef<HTMLDivElement>(null);

  // Initial fetch of rate limit status
  useEffect(() => {
    async function fetchRateLimit() {
      try {
        const res = await fetch('/api/rate-limit');
        if (res.ok) {
          const data = await res.json();
          setRemainingChecks(data.remaining);
          setTotalLimit(data.limit || 50);
          setResetTimestamp(data.resetTimestamp);
        }
      } catch (e) {
        console.warn('Could not fetch rate limit:', e);
      }
    }
    fetchRateLimit();
  }, []);

  const handleScrollToChecker = () => {
    checkerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCheckCustomer = async (phone: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setReport(null);
    setLastQueriedPhone(phone);

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json() as PhoneCheckResponse;

      if (!response.ok) {
        // Handle 429 Rate Limit
        if (response.status === 429) {
          if (data.rateLimit) {
            setRemainingChecks(0);
            setResetTimestamp(data.rateLimit.resetTimestamp);
          }
          setErrorMessage(data.error || 'Daily limit reached. Free checks reset daily. Please try again tomorrow.');
          return;
        }

        // Other validation or API errors
        setErrorMessage(data.error || 'Unable to complete the check right now. Please try again in a moment.');
        return;
      }

      // Successful check response
      setReport(data);
      if (data.rateLimit) {
        setRemainingChecks(data.rateLimit.remaining);
        setTotalLimit(data.rateLimit.limit);
        setResetTimestamp(data.rateLimit.resetTimestamp);
      }
    } catch (err) {
      console.error('Network error during check:', err);
      setErrorMessage('Network connection error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setErrorMessage(null);
    setLastQueriedPhone('');
    handleScrollToChecker();
  };

  const handlePrint = () => {
    window.print();
  };

  const isRateLimited = remainingChecks !== null && remainingChecks <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* Top Navbar */}
      <Navbar
        remainingChecks={remainingChecks}
        totalLimit={totalLimit}
        onOpenHowItWorks={() => setShowHowItWorks(true)}
        onOpenAbout={() => setShowAbout(true)}
        onScrollToChecker={handleScrollToChecker}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 sm:pt-12 pb-16 space-y-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            <span className="flex h-2 w-2 rounded-full bg-sky-500" />
            <span>Authorized BD Courier Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight font-display leading-[1.15]">
            Check Customer Delivery Risk <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-slate-800 to-sky-800">
              Before You Ship
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Review available courier delivery history and make more informed order decisions. Reduce returned Cash-on-Delivery orders across Bangladesh.
          </p>
        </section>

        {/* Rate Limit Reached Warning if applicable */}
        {isRateLimited && (
          <RateLimitBanner
            remaining={remainingChecks ?? 0}
            limit={totalLimit}
            resetTimestamp={resetTimestamp}
          />
        )}

        {/* Main Checker Form Anchor */}
        <section ref={checkerRef} className="scroll-mt-24">
          <CheckerForm
            onSubmit={handleCheckCustomer}
            isLoading={isLoading}
            disabled={isRateLimited}
          />
        </section>

        {/* Dynamic State Display: Loading, Error, Result, or Empty */}
        {isLoading && <LoadingState phone={lastQueriedPhone} />}

        {!isLoading && errorMessage && (
          <ErrorState
            message={errorMessage}
            onRetry={() => handleCheckCustomer(lastQueriedPhone)}
            onReset={handleReset}
          />
        )}

        {/* Result Dashboard */}
        {!isLoading && report && (
          <section className="space-y-6 animate-in fade-in duration-300">
            {report.hasData && report.risk && report.data ? (
              <>
                {/* Score and Main Verdict Card */}
                <RiskScoreCard
                  risk={report.risk}
                  maskedPhone={report.maskedPhone}
                  queryTimestamp={report.queryTimestamp}
                  isMockData={report.isMockData}
                />

                {/* Summary Aggregate Stats */}
                <SummaryStats data={report.data} />

                {/* Deterministic Indicators */}
                <RiskIndicators indicators={report.risk.indicators} />

                {/* Individual Courier Network Breakdown */}
                <CourierGrid couriers={report.data.couriers} />

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-sm text-white shadow-sm hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer"
                    id="check-another-btn"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Check Another Customer</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-medium text-sm text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    id="print-report-btn"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>Print Report</span>
                  </button>
                </div>
              </>
            ) : (
              <EmptyState
                maskedPhone={report.maskedPhone}
                onReset={handleReset}
              />
            )}
          </section>
        )}

        {/* Feature Explainer / Educational Value Section for BD Merchants */}
        <section className="mt-16 rounded-2xl bg-white p-8 sm:p-10 border border-slate-200/90 shadow-sm">
          <div className="max-w-2xl mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 font-display">
              Protect Your E-Commerce Margin from Return Losses
            </h3>
            <p className="mt-1.5 text-sm text-slate-600">
              Courier Return to Origin (RTO) is one of the highest operational expenses for online shops in Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold mb-3 font-mono text-sm">
                01
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Cash-on-Delivery Security
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spot repeat return patterns before dispatching packages with high return transport fees.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3 font-mono text-sm">
                02
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Multi-Courier Verification
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aggregated records cross-check Pathao, SteadFast, RedX, Paperfly, CourierFast, and CarryBee.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-3 font-mono text-sm">
                03
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Objective Decision Making
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transparent delivery risk scores empower your team to ask for partial advance payment when needed.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onOpenLegal={(tab) => setLegalModalTab(tab)} />

      {/* Modals */}
      <HowItWorksModal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
      />

      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
      />

      <LegalModal
        isOpen={legalModalTab !== null}
        initialTab={legalModalTab || 'privacy'}
        onClose={() => setLegalModalTab(null)}
      />
    </div>
  );
}
