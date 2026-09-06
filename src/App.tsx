import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { CheckerForm } from './components/CheckerForm';
import { LoadingState } from './components/LoadingState';
import { ReviewRecommendationBanner } from './components/ReviewRecommendationBanner';
import { SaaSMetricCards } from './components/SaaSMetricCards';
import { CourierTable } from './components/CourierTable';
import { DeliveryStatusDonut } from './components/DeliveryStatusDonut';
import { BottomAlertBanner } from './components/BottomAlertBanner';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { RateLimitBanner } from './components/RateLimitBanner';
import { MerchantBenefits } from './components/MerchantBenefits';
import { LegalModal } from './components/LegalModal';
import { Footer } from './components/Footer';
import { PhoneCheckResponse } from './types/index';
import { RotateCcw, Printer, Info, Download } from 'lucide-react';
import { exportReportToPdf } from './utils/pdfExport';

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
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  const checkerRef = useRef<HTMLDivElement>(null);

  // Initial fetch of rate limit status only - no automatic check on reload to save user tokens
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

  // Dynamic SEO page title and meta tag updates based on application state
  useEffect(() => {
    const baseTitle = 'FraudCheck BD — Customer Delivery Risk Checker';
    const baseDescription =
      'Check available Bangladesh courier delivery history and assess customer delivery risk before shipping.';

    let pageTitle = baseTitle;
    let metaDescription = baseDescription;

    if (isLoading) {
      const target = lastQueriedPhone || 'Customer';
      pageTitle = `Checking ${target}... | FraudCheck BD`;
      metaDescription = `Verifying courier delivery records and assessing delivery risk for ${target}...`;
    } else if (errorMessage) {
      pageTitle = 'Check Failed | FraudCheck BD';
      metaDescription = errorMessage;
    } else if (report) {
      const phoneDisplay = report.maskedPhone || lastQueriedPhone || 'Customer';
      if (report.hasData && report.data) {
        pageTitle = `Customer Report: ${phoneDisplay} | FraudCheck BD`;
        const successRate = report.data.successRate;
        const total = report.data.totalOrders;
        const riskLevel = report.risk?.level || 'ASSESSED';
        metaDescription = `Customer Report for ${phoneDisplay}: ${successRate}% delivery success rate across ${total} courier orders. Assessed risk: ${riskLevel}.`;
      } else {
        pageTitle = `Customer Report: ${phoneDisplay} (No History) | FraudCheck BD`;
        metaDescription = `No courier delivery history found for ${phoneDisplay} across Bangladesh partner courier networks.`;
      }
    }

    // Update document title
    document.title = pageTitle;

    // Helper to safely set meta tags
    const setMetaTag = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) {
        el.setAttribute('content', content);
      }
    };

    setMetaTag('meta[name="description"]', metaDescription);
    setMetaTag('meta[property="og:title"]', pageTitle);
    setMetaTag('meta[property="og:description"]', metaDescription);
    setMetaTag('meta[name="twitter:title"]', pageTitle);
    setMetaTag('meta[name="twitter:description"]', metaDescription);
  }, [isLoading, report, errorMessage, lastQueriedPhone]);

  const handleScrollToChecker = () => {
    checkerRef.current?.scrollIntoView({ behavior: 'smooth' });
    const phoneInput = document.getElementById('phone-input') as HTMLInputElement | null;
    phoneInput?.focus();
  };

  const handleCheckCustomer = async (phone: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLastQueriedPhone(phone);

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = (await response.json()) as PhoneCheckResponse;

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

  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    if (!report) return;
    setIsExportingPdf(true);
    try {
      await exportReportToPdf(report, lastQueriedPhone);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const isRateLimited = remainingChecks !== null && remainingChecks <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 font-sans">
      {/* Top Navbar */}
      <Navbar
        remainingChecks={remainingChecks}
        totalLimit={totalLimit}
        onFocusSearch={handleScrollToChecker}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 pt-6 sm:pt-8 pb-16 space-y-6">
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

        {/* Dynamic State Display: Loading, Error, Result, or Merchant Showcase */}
        {isLoading && <LoadingState phone={lastQueriedPhone} />}

        {!isLoading && errorMessage && (
          <ErrorState
            message={errorMessage}
            onRetry={() => handleCheckCustomer(lastQueriedPhone)}
            onReset={handleReset}
          />
        )}

        {!isLoading && !report && !errorMessage && (
          <MerchantBenefits />
        )}

        {/* Result Dashboard */}
        {!isLoading && report && (
          <section className="space-y-6 animate-in fade-in duration-300">
            {/* Account / Subscription API Notice */}
            {report.apiNotice && (
              <div
                className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5 text-xs text-amber-950 shadow-xs"
                id="api-notice-banner"
              >
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5 stroke-[2]" />
                <div className="leading-relaxed font-medium">
                  <span className="font-bold text-amber-950">Notice:</span> {report.apiNotice}
                </div>
              </div>
            )}

            {report.hasData && report.risk && report.data ? (
              <>
                {/* 1. Review / Recommendation Alert Banner */}
                <ReviewRecommendationBanner
                  risk={report.risk}
                  successRate={report.data.successRate}
                  onPrint={handlePrint}
                  onExportPdf={handleExportPdf}
                  isExportingPdf={isExportingPdf}
                  phone={report.maskedPhone}
                />

                {/* 2. 4 Stat Metric Cards */}
                <SaaSMetricCards
                  totalOrders={report.data.totalOrders}
                  delivered={report.data.delivered}
                  cancelled={report.data.cancelled + (report.data.returned > report.data.cancelled ? report.data.returned - report.data.cancelled : 0)}
                  successRate={report.data.successRate}
                />

                {/* 3. Side-by-Side 2-Column Section: Courier Table & Donut Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Left Column: Courier Breakdown Table (7 cols on lg) */}
                  <div className="lg:col-span-7 h-full">
                    <CourierTable
                      couriers={report.data.couriers}
                      totalOrders={report.data.totalOrders}
                      delivered={report.data.delivered}
                      cancelled={report.data.cancelled + (report.data.returned > report.data.cancelled ? report.data.returned - report.data.cancelled : 0)}
                    />
                  </div>

                  {/* Right Column: Delivery Status Donut Chart (5 cols on lg) */}
                  <div className="lg:col-span-5 h-full">
                    <DeliveryStatusDonut
                      successful={report.data.delivered}
                      cancelled={report.data.cancelled + (report.data.returned > report.data.cancelled ? report.data.returned - report.data.cancelled : 0)}
                      successRate={report.data.successRate}
                    />
                  </div>
                </div>

                {/* 4. Bottom Alert Banner */}
                <BottomAlertBanner
                  risk={report.risk}
                  successRate={report.data.successRate}
                />

                {/* 5. Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-sm text-white shadow-xs hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer"
                    id="check-another-btn"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Check Another Customer</span>
                  </button>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleExportPdf}
                      disabled={isExportingPdf}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-medium text-sm text-slate-700 border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                      id="export-pdf-btn"
                    >
                      {isExportingPdf ? (
                        <div className="h-4 w-4 rounded-full border-2 border-slate-400 border-t-slate-900 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 text-emerald-600" />
                      )}
                      <span>{isExportingPdf ? 'Generating PDF...' : 'Export as PDF'}</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-medium text-sm text-slate-700 border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
                      id="print-report-btn"
                    >
                      <Printer className="w-4 h-4 text-slate-500" />
                      <span>Print Report</span>
                    </button>
                  </div>
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
      </main>

      {/* Footer */}
      <Footer onOpenLegal={(tab) => setLegalModalTab(tab)} />

      <LegalModal
        isOpen={legalModalTab !== null}
        initialTab={legalModalTab || 'privacy'}
        onClose={() => setLegalModalTab(null)}
      />
    </div>
  );
}
