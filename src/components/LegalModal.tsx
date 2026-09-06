import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Mail, Send, Check, Award } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: 'privacy' | 'terms' | 'license' | 'contact';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'license' | 'contact'>(initialTab);
  const [contactSent, setContactSent] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactEmail('');
      setContactMessage('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-4 sm:gap-6 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-slate-900 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'terms'
                ? 'border-slate-900 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('license')}
            className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'license'
                ? 'border-slate-900 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Software License
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'contact'
                ? 'border-slate-900 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Contact & Support
          </button>
        </div>

        {/* Privacy Tab Content */}
        {activeTab === 'privacy' && (
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <h4 className="text-base font-bold text-slate-900">Privacy & Data Handling Standards</h4>
            <p>
              FraudCheck BD values the confidentiality and privacy rights of consumers and merchants. This privacy declaration explains our data processing practices.
            </p>
            <div className="space-y-3 pt-2">
              <div>
                <strong className="text-slate-900 block">1. Masked Presentation:</strong>
                Phone numbers submitted for courier risk verification are masked in client responses (e.g. <code>01*******89</code>) to safeguard individual privacy.
              </div>
              <div>
                <strong className="text-slate-900 block">2. No Commercial Resale:</strong>
                We do not sell, rent, or trade customer contact information or query logs to any third-party marketing companies.
              </div>
              <div>
                <strong className="text-slate-900 block">3. Ephemeral Query Processing:</strong>
                Phone numbers submitted through the public checker are relayed directly to authorized courier API endpoints server-side and are not permanently archived in public searchable directories.
              </div>
              <div>
                <strong className="text-slate-900 block">4. Rate Limiting & Abuse Prevention:</strong>
                Client IP addresses are temporarily tracked in memory or secure cache exclusively to enforce the 50 free daily checks policy and prevent denial-of-service abuse.
              </div>
            </div>
          </div>
        )}

        {/* Terms Tab Content */}
        {activeTab === 'terms' && (
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <h4 className="text-base font-bold text-slate-900">Terms of Service & Disclaimer</h4>
            <p>
              By accessing FraudCheck BD, you agree to the following terms and operating parameters:
            </p>
            <div className="space-y-3 pt-2">
              <div>
                <strong className="text-slate-900 block">1. Informational Risk Scoring Only:</strong>
                The delivery risk score and indicators provided by FraudCheck BD are calculated solely on available courier delivery history across partner logistics services. This report <strong>is not a definitive determination of fraud, personal character, or malicious intent</strong>.
              </div>
              <div>
                <strong className="text-slate-900 block">2. Independent Merchant Decision:</strong>
                Merchants are solely responsible for all final decisions regarding whether to dispatch, require advance payment, or cancel an order. FraudCheck BD shall not be held liable for any shipping losses, lost merchandise, or lost sales opportunities.
              </div>
              <div>
                <strong className="text-slate-900 block">3. Fair Usage Quota:</strong>
                The free tier allows up to 50 checks per IP per calendar day. Automated scraping, unauthorized bulk queries, and attempts to circumvent rate limits are strictly prohibited.
              </div>
            </div>
          </div>
        )}

        {/* License Tab Content */}
        {activeTab === 'license' && (
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900">
                <Award className="w-5 h-5 text-blue-600" />
                <h4 className="text-base font-bold">GitHub Software License (MIT)</h4>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                MIT License
              </span>
            </div>

            <p className="text-xs text-slate-500">
              This project is licensed under the standard open-source MIT License by{' '}
              <strong className="text-slate-900">RAYHAN BISWAS</strong>. You can copy this license directly into your GitHub repository&apos;s <code>LICENSE</code> file.
            </p>

            {/* GitHub Style Code Box */}
            <div className="relative rounded-xl border border-slate-200 bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto shadow-inner">
              <pre className="whitespace-pre-wrap leading-relaxed text-[11px] sm:text-xs">
{`MIT License

Copyright (c) 2026 RAYHAN BISWAS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
              </pre>

              <button
                type="button"
                onClick={() => {
                  const lic = `MIT License\n\nCopyright (c) 2026 RAYHAN BISWAS\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.`;
                  navigator.clipboard.writeText(lic);
                  alert('GitHub MIT License copied to clipboard!');
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Copy for GitHub (LICENSE)</span>
              </button>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">GitHub Setup Guide:</span>
                Create a file named <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold">LICENSE</code> in your GitHub repository root and paste the text above. GitHub will automatically detect it as the official MIT License for <strong className="text-slate-900">RAYHAN BISWAS</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab Content */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900">Contact & Merchant Support</h4>
            <p className="text-sm text-slate-600">
              Have questions about your API limits, courier integration, or feedback for the FraudCheck BD team? Send us a note below.
            </p>

            {contactSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>Thank you! Your message has been received. Our team will follow up shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Your Business Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="merchant@yourshop.com.bd"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your inquiry, courier integration question, or feedback..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
