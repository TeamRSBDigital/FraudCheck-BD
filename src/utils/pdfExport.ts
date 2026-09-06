import { PhoneCheckResponse } from '../types';

export async function exportReportToPdf(report: PhoneCheckResponse, phoneToDisplay: string): Promise<void> {
  // Dynamically import html2pdf in the browser
  const html2pdfModule: any = await import('html2pdf.js');
  const html2pdf = html2pdfModule.default || html2pdfModule;

  const data = report.data;
  const risk = report.risk;
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const reportId = `FC-BD-${Date.now().toString().slice(-6)}`;
  const displayPhone = report.maskedPhone || phoneToDisplay || 'Unknown Customer';

  const isLowRisk = risk?.level === 'LOW RISK';
  const isHighRisk = risk?.level === 'HIGH RISK';

  const riskColor = isHighRisk ? '#e11d48' : isLowRisk ? '#059669' : '#d97706';
  const riskBg = isHighRisk ? '#fff1f2' : isLowRisk ? '#ecfdf5' : '#fffbeb';
  const riskBorder = isHighRisk ? '#fecdd3' : isLowRisk ? '#a7f3d0' : '#fde68a';

  const total = data?.totalOrders || 0;
  const delivered = data?.delivered || 0;
  const cancelled = (data?.cancelled || 0) + (data?.returned && data.returned > data.cancelled ? data.returned - data.cancelled : 0);
  const successRate = data?.successRate ?? (total > 0 ? Math.round((delivered / total) * 100) : 0);

  // Build the clean, branded printable container
  const container = document.createElement('div');
  container.id = 'fraudcheck-pdf-template';
  container.style.width = '780px';
  container.style.padding = '36px 40px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.zIndex = '-1000';
  container.style.boxSizing = 'border-box';

  container.innerHTML = `
    <!-- Top Branded Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 38px; height: 38px; border-radius: 10px; background-color: #0f172a; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 20px;">
            🛡️
          </div>
          <div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">
              FraudCheck <span style="color: #059669;">BD</span>
            </h1>
            <p style="margin: 2px 0 0; font-size: 11px; color: #64748b; font-weight: 600;">
              Bangladesh Multi-Courier Delivery Verification & Fraud Prevention
            </p>
          </div>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="display: inline-block; padding: 4px 10px; border-radius: 6px; background-color: #f1f5f9; border: 1px solid #cbd5e1; font-size: 10px; font-weight: 700; color: #334155; text-transform: uppercase;">
          Audit Report: ${reportId}
        </div>
        <p style="margin: 4px 0 0; font-size: 11px; color: #64748b;">Generated: ${formattedDate}</p>
      </div>
    </div>

    <!-- Customer & Risk Assessment Banner -->
    <div style="border-radius: 14px; border: 1.5px solid ${riskBorder}; background-color: ${riskBg}; padding: 18px 22px; margin-bottom: 22px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">
            Customer Verification Target
          </span>
          <div style="font-size: 20px; font-weight: 800; font-family: monospace; color: #0f172a; margin-top: 2px;">
            ${displayPhone}
          </div>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; padding: 6px 14px; border-radius: 9999px; background-color: ${riskColor}; color: #ffffff; font-size: 12px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
            ${risk?.level || 'ASSESSED'}
          </span>
          <div style="font-size: 11px; font-weight: 700; color: ${riskColor}; margin-top: 4px;">
            ${risk?.verdictTitle || 'Customer History Evaluated'}
          </div>
        </div>
      </div>

      <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed ${riskBorder};">
        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #334155; font-weight: 500;">
          <strong>Merchant Recommendation:</strong> ${risk?.summary || 'Review customer delivery history across partner couriers before shipping.'}
        </p>
      </div>
    </div>

    <!-- Key Metrics Grid -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
      <div style="border-radius: 10px; border: 1px solid #e2e8f0; background-color: #f8fafc; padding: 14px; text-align: center;">
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b;">Total Orders</div>
        <div style="font-size: 24px; font-weight: 800; font-family: monospace; color: #0f172a; margin-top: 4px;">${total}</div>
        <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">All Couriers</div>
      </div>
      <div style="border-radius: 10px; border: 1px solid #a7f3d0; background-color: #ecfdf5; padding: 14px; text-align: center;">
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #065f46;">Delivered</div>
        <div style="font-size: 24px; font-weight: 800; font-family: monospace; color: #059669; margin-top: 4px;">${delivered}</div>
        <div style="font-size: 10px; color: #059669; margin-top: 2px;">Accepted Parcels</div>
      </div>
      <div style="border-radius: 10px; border: 1px solid #fecdd3; background-color: #fff1f2; padding: 14px; text-align: center;">
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #9f1239;">Cancelled / Returned</div>
        <div style="font-size: 24px; font-weight: 800; font-family: monospace; color: #e11d48; margin-top: 4px;">${cancelled}</div>
        <div style="font-size: 10px; color: #e11d48; margin-top: 2px;">Failed Delivery</div>
      </div>
      <div style="border-radius: 10px; border: 1px solid #e2e8f0; background-color: #f8fafc; padding: 14px; text-align: center;">
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b;">Success Rate</div>
        <div style="font-size: 24px; font-weight: 800; font-family: monospace; color: ${riskColor}; margin-top: 4px;">${successRate}%</div>
        <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Completion Ratio</div>
      </div>
    </div>

    <!-- Detailed Courier Breakdown Table -->
    <div style="border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 22px;">
      <div style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 12px 18px; font-weight: 700; font-size: 12px; color: #0f172a;">
        Bangladesh Courier Network Breakdown
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
        <thead>
          <tr style="background-color: #ffffff; border-bottom: 1px solid #e2e8f0; color: #64748b; text-transform: uppercase; font-size: 10px; font-weight: 700;">
            <th style="padding: 10px 18px;">Courier Name</th>
            <th style="padding: 10px 18px; text-align: center;">Total</th>
            <th style="padding: 10px 18px; text-align: center;">Delivered</th>
            <th style="padding: 10px 18px; text-align: center;">Cancelled</th>
            <th style="padding: 10px 18px; text-align: right;">Success Rate</th>
          </tr>
        </thead>
        <tbody>
          ${(data?.couriers || [])
            .map(
              (c, idx) => `
            <tr style="border-bottom: 1px solid #f1f5f9; background-color: ${idx % 2 === 0 ? '#ffffff' : '#fcfcfd'};">
              <td style="padding: 10px 18px; font-weight: 700; color: #0f172a;">${c.name}</td>
              <td style="padding: 10px 18px; text-align: center; font-family: monospace; font-weight: 600;">${c.totalOrders}</td>
              <td style="padding: 10px 18px; text-align: center; font-family: monospace; font-weight: 600; color: #059669;">${c.delivered}</td>
              <td style="padding: 10px 18px; text-align: center; font-family: monospace; font-weight: 600; color: #e11d48;">${c.cancelled}</td>
              <td style="padding: 10px 18px; text-align: right; font-family: monospace; font-weight: 700; color: ${
                c.successRate >= 75 ? '#059669' : c.successRate >= 50 ? '#d97706' : '#e11d48'
              };">${c.successRate}%</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <!-- Security & Verification Footnote -->
    <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b;">
      <div>
        <span style="font-weight: 700; color: #0f172a;">Data Sources:</span> SteadFast, Pathao, RedX, Paperfly, CourierFast, CarryBee
      </div>
      <div>
        Confidential Merchant Verification • FraudCheck BD
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const cleanPhone = (report.maskedPhone || phoneToDisplay || 'customer').replace(/[^0-9a-zA-Z]/g, '');
    const filename = `FraudCheck-BD-${cleanPhone}-${new Date().toISOString().slice(0, 10)}.pdf`;

    const opt = {
      margin: [8, 8, 8, 8],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    await html2pdf().set(opt).from(container).save();
  } finally {
    // Always remove temporary container from DOM
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}
