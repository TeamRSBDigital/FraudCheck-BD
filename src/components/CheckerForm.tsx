import React, { useState, useEffect } from 'react';
import { Search, X, AlertCircle, ShieldCheck, PhoneCall } from 'lucide-react';
import { normalizeBdPhone, sanitizePhoneInput, isValidBdPhone } from '../../lib/phone';

interface CheckerFormProps {
  onCheck?: (phone: string) => void;
  onSubmit?: (phone: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  initialValue?: string;
}

export const CheckerForm: React.FC<CheckerFormProps> = ({
  onCheck,
  onSubmit,
  isLoading,
  disabled = false,
  initialValue = '',
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>(initialValue);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const triggerCheck = (phone: string) => {
    if (onCheck) onCheck(phone);
    else if (onSubmit) onSubmit(phone);
  };

  useEffect(() => {
    if (initialValue) {
      setPhoneNumber(normalizeBdPhone(initialValue));
    }
  }, [initialValue]);

  // Handle phone input changes with immediate normalization
  const processInput = (raw: string) => {
    const cleaned = sanitizePhoneInput(raw);

    // Limit to max 11 digits
    const truncated = cleaned.slice(0, 11);
    setPhoneNumber(truncated);

    // Validate as user types
    if (truncated.length > 0) {
      if (!truncated.startsWith('01')) {
        setErrorMessage('Phone number must start with 01');
      } else if (
        truncated.length >= 3 &&
        !['013', '014', '015', '016', '017', '018', '019'].includes(
          truncated.substring(0, 3)
        )
      ) {
        setErrorMessage('Invalid operator prefix (use 013-019)');
      } else if (truncated.length === 11 && !isValidBdPhone(truncated)) {
        setErrorMessage('Invalid 11-digit Bangladeshi mobile number');
      } else {
        setErrorMessage(null);
      }
    } else {
      setErrorMessage(null);
    }

    // Auto-check when reaching 11 valid digits
    if (truncated.length === 11 && isValidBdPhone(truncated) && !isLoading) {
      setErrorMessage(null);
      triggerCheck(truncated);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    processInput(pasted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading || disabled) return;

    if (!phoneNumber) {
      setErrorMessage('Please enter an 11-digit mobile number');
      return;
    }

    if (!isValidBdPhone(phoneNumber)) {
      setErrorMessage('Please enter a valid 11-digit Bangladeshi number (e.g. 01xxxxxxxxx)');
      return;
    }

    setErrorMessage(null);
    triggerCheck(phoneNumber);
  };

  const handleClear = () => {
    setPhoneNumber('');
    setErrorMessage(null);
    const input = document.getElementById('phone-input');
    input?.focus();
  };

  const isComplete = phoneNumber.length === 11 && isValidBdPhone(phoneNumber);

  return (
    <div
      id="checker-card"
      className="relative rounded-2xl bg-white shadow-sm border border-slate-200/90 overflow-hidden transition-all"
    >
      {/* SaaS Header Banner with Rich Navy-to-Indigo Gradient */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 px-6 py-5 text-white border-b border-indigo-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-900/60 border border-indigo-700/60 text-[11px] font-medium text-indigo-200 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Bangladesh Courier Fraud Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-display text-white">
              Customer Courier Risk Check
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-300 font-medium">
              পার্সেল পাঠানোর পূর্বে কাস্টমারের ডেলিভারি হিস্ট্রি ও রিস্ক লেভেল যাচাই করুন
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-indigo-200 bg-indigo-900/40 px-3 py-1.5 rounded-xl border border-indigo-700/50 self-start sm:self-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Multi-Courier Verification</span>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="p-5 sm:p-7">
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="phone-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Customer Mobile Number
              </label>
              <span className="text-xs font-mono font-medium text-slate-500">
                {phoneNumber.length}/11 digits
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 flex items-center">
                {/* BD Flag & Prefix Pill */}
                <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none text-slate-500 z-10 select-none border-r border-slate-200 pr-2.5">
                  <span className="text-base" role="img" aria-label="Bangladesh Flag">🇧🇩</span>
                  <span className="text-xs font-mono font-semibold text-slate-700">+88</span>
                </div>

                <input
                  id="phone-input"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={11}
                  disabled={isLoading || disabled}
                  placeholder="01XXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => processInput(e.target.value)}
                  onPaste={handlePaste}
                  className={`w-full h-12 pl-24 pr-11 text-base font-mono font-semibold rounded-xl border bg-white transition-all outline-none placeholder:text-slate-400 placeholder:font-mono ${
                    errorMessage
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-50'
                      : isComplete
                      ? 'border-emerald-500 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50'
                      : 'border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10'
                  } disabled:bg-slate-50 disabled:text-slate-400`}
                />

                {/* Clear Button */}
                {phoneNumber && !isLoading && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Clear number"
                    aria-label="Clear number"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Loading spinner inside input */}
                {isLoading && (
                  <div className="absolute right-3.5 flex items-center">
                    <div className="h-4 w-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                  </div>
                )}
              </div>

              {/* High-Contrast Vibrant Search Button */}
              <button
                type="submit"
                id="check-customer-btn"
                disabled={isLoading || disabled}
                className="h-12 sm:w-32 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] px-6 font-bold text-sm text-white shadow-sm shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                {isLoading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 stroke-[2.3]" />
                    <span>Check</span>
                  </>
                )}
              </button>
            </div>

            {/* Error or Auto-check status */}
            <div className="mt-2 flex items-center justify-between min-h-[18px]">
              {errorMessage ? (
                <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600" id="phone-error-msg">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              ) : isComplete && isLoading ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                  <span>Checking SteadFast, Pathao, RedX, Paperfly records...</span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  ১১ ডিজিটের মোবাইল নম্বর লিখলেই অটোমেটিক চেক হবে (013-019)
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
