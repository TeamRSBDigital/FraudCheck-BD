/**
 * Delivery Risk Engine
 * Deterministic, transparent rules engine evaluating courier delivery history.
 *
 * IMPORTANT:
 * This engine calculates Delivery Risk Indicators, NOT definitive fraud determinations.
 * Terminology is strictly kept as "Delivery Risk", "Risk Indicators", "Order History".
 */

import { AggregatedCourierData, RiskAssessment, RiskIndicator, RiskLevel } from '../src/types/index';

const DISCLAIMER_TEXT =
  'Risk assessment is based on available courier delivery history and should not be treated as a definitive fraud determination.';

export function calculateDeliveryRisk(data: AggregatedCourierData): RiskAssessment {
  const { totalOrders, delivered, cancelled, returned, successRate, returnRate, couriers } = data;

  // Case 1: No Courier Data Found
  if (!totalOrders || totalOrders === 0) {
    return {
      score: 0,
      level: 'NO DATA',
      verdictTitle: 'No Courier History Found',
      summary: 'Insufficient delivery history across partner couriers to calculate a risk score.',
      confidence: 'LOW',
      indicators: [
        {
          type: 'neutral',
          label: 'Unrecorded Customer',
          description: 'No verified completed, returned, or cancelled parcels found in available courier databases.',
        },
        {
          type: 'neutral',
          label: 'Caution on High-Value COD',
          description: 'Standard phone or OTP verification is recommended prior to dispatching expensive Cash-On-Delivery orders.',
        },
      ],
      disclaimer: DISCLAIMER_TEXT,
    };
  }

  const indicators: RiskIndicator[] = [];
  let rawScore = 0; // 0 = safest, 100 = highest delivery risk

  // 1. Success Rate Signal
  if (successRate >= 90) {
    rawScore -= 30;
    indicators.push({
      type: 'positive',
      label: 'High Completion Ratio',
      description: `Customer successfully accepted ${successRate}% of delivered parcels (${delivered} completed).`,
    });
  } else if (successRate >= 75) {
    rawScore += 10;
    indicators.push({
      type: 'positive',
      label: 'Acceptable Delivery Rate',
      description: `${successRate}% completion rate across recorded courier shipments.`,
    });
  } else if (successRate >= 50) {
    rawScore += 35;
    indicators.push({
      type: 'warning',
      label: 'Moderate Delivery Failures',
      description: `Approximately ${(100 - successRate).toFixed(1)}% of orders were either returned or cancelled before completion.`,
    });
  } else {
    rawScore += 60;
    indicators.push({
      type: 'negative',
      label: 'Low Delivery Completion',
      description: `Only ${successRate}% of shipments were delivered successfully. Significant risk of delivery refusal.`,
    });
  }

  // 2. Return Rate Signal (Primary driver of shipping cost losses for BD merchants)
  if (returnRate >= 35) {
    rawScore += 40;
    indicators.push({
      type: 'negative',
      label: 'Elevated Return Rate',
      description: `${returnRate}% return rate (${returned} returned parcels). Courier fees may be at risk on COD.`,
    });
  } else if (returnRate >= 20) {
    rawScore += 25;
    indicators.push({
      type: 'warning',
      label: 'Noticeable Return Frequency',
      description: `${returned} parcels were marked as returned to merchant across couriers.`,
    });
  } else if (returnRate === 0 && totalOrders >= 5) {
    rawScore -= 15;
    indicators.push({
      type: 'positive',
      label: 'Zero Recorded Returns',
      description: `No returned or rejected packages recorded in history for this customer.`,
    });
  }

  // 3. Cancellation Signal
  const cancelRate = totalOrders > 0 ? (cancelled / totalOrders) * 100 : 0;
  if (cancelRate >= 25 && cancelled >= 3) {
    rawScore += 20;
    indicators.push({
      type: 'warning',
      label: 'Frequent Order Cancellations',
      description: `${cancelled} orders cancelled prior to or during transit.`,
    });
  }

  // 4. Volume & Breadth of Courier Experience
  let confidence: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
  if (totalOrders >= 20) {
    confidence = 'HIGH';
    indicators.push({
      type: 'neutral',
      label: 'Extensive Delivery History',
      description: `High sample size with ${totalOrders} total recorded shipments across ${couriers.length} courier network(s).`,
    });
  } else if (totalOrders <= 3) {
    confidence = 'LOW';
    indicators.push({
      type: 'neutral',
      label: 'Limited Historical Sample',
      description: `Only ${totalOrders} total order(s) on file. Risk metrics should be weighed cautiously.`,
    });
  }

  // 5. Multi-courier validation
  if (couriers.length >= 2) {
    indicators.push({
      type: 'neutral',
      label: 'Multi-Courier Verification',
      description: `Data cross-referenced across ${couriers.map((c) => c.name).join(', ')}.`,
    });
  }

  // Baseline calibration to 0 - 100 range
  let normalizedScore = Math.max(0, Math.min(100, Math.round(rawScore + 25)));

  // Overrides based on return rate extremes:
  if (returnRate >= 40 && totalOrders >= 5) {
    normalizedScore = Math.max(72, normalizedScore);
  } else if (successRate >= 92 && returnRate <= 5 && totalOrders >= 5) {
    normalizedScore = Math.min(22, normalizedScore);
  }

  // Assign Level
  let level: RiskLevel = 'LOW RISK';
  let verdictTitle = 'Low Delivery Risk';
  let summary = 'This customer has a strong record of successful parcel completions.';

  if (normalizedScore >= 66) {
    level = 'HIGH RISK';
    verdictTitle = 'High Delivery Risk';
    summary = 'Significant rate of returned or cancelled orders. Recommend pre-dispatch phone confirmation or partial advance payment.';
  } else if (normalizedScore >= 31) {
    level = 'MEDIUM RISK';
    verdictTitle = 'Moderate Delivery Risk';
    summary = 'Customer has mixed delivery results or moderate return history. Standard address verification recommended.';
  }

  return {
    score: normalizedScore,
    level,
    verdictTitle,
    summary,
    indicators,
    confidence,
    disclaimer: DISCLAIMER_TEXT,
  };
}
