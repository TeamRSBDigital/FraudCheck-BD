/**
 * BD Courier Data Normalizer
 * Transforms various raw API schemas into a unified, sanitized internal format.
 */

import { AggregatedCourierData, CourierStats } from '../../src/types/index';
import { RawBdCourierResponse, RawCourierEntry } from './types';

// Standard known courier brands in Bangladesh
const COURIER_META: Record<string, { name: string; id: string }> = {
  steadfast: { id: 'steadfast', name: 'SteadFast' },
  pathao: { id: 'pathao', name: 'Pathao' },
  redx: { id: 'redx', name: 'RedX' },
  paperfly: { id: 'paperfly', name: 'Paperfly' },
  courierfast: { id: 'courierfast', name: 'CourierFast' },
  courrierfast: { id: 'courierfast', name: 'CourierFast' },
  carrybee: { id: 'carrybee', name: 'CarryBee' },
  parceldex: { id: 'parceldex', name: 'ParcelDex' },
};

function parseNumber(val: unknown, fallback = 0): number {
  if (typeof val === 'number' && !isNaN(val)) return Math.max(0, Math.floor(val));
  if (typeof val === 'string') {
    const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
    return isNaN(parsed) ? fallback : Math.max(0, parsed);
  }
  return fallback;
}

function parseRate(val: unknown, fallback = 0): number {
  if (typeof val === 'number' && !isNaN(val)) {
    return Math.min(100, Math.max(0, Math.round(val * 10) / 10));
  }
  if (typeof val === 'string') {
    const parsed = parseFloat(val.replace(/[^0-9.]/g, ''));
    return isNaN(parsed) ? fallback : Math.min(100, Math.max(0, Math.round(parsed * 10) / 10));
  }
  return fallback;
}

function normalizeCourierEntry(id: string, name: string, raw: RawCourierEntry): CourierStats | null {
  if (!raw || typeof raw !== 'object') return null;

  const totalOrders = parseNumber(
    raw.total_parcel ?? raw.total_orders ?? raw.total
  );
  const delivered = parseNumber(
    raw.success_parcel ?? raw.delivered_parcel ?? raw.delivered ?? raw.success
  );
  const rawCancelled = parseNumber(
    raw.cancelled_parcel ?? raw.cancelled
  );
  const rawReturned = parseNumber(
    raw.returned_parcel ?? raw.returned
  );

  // If there are zero recorded parcels for this courier, omit
  if (totalOrders === 0 && delivered === 0 && rawCancelled === 0 && rawReturned === 0) {
    return null;
  }

  // If BD Courier only returns cancelled_parcel (which represents non-delivered parcels),
  // distinguish returned vs cancelled gracefully
  let returned = rawReturned;
  let cancelled = rawCancelled;
  if (rawReturned === 0 && rawCancelled > 0 && totalOrders > 0) {
    // In many BD couriers, uncompleted orders returned to origin are logged under cancelled_parcel
    // Show them as returned or split
    returned = rawCancelled;
    cancelled = Math.max(0, totalOrders - delivered - returned);
  }

  // Calculate or pick success rate
  let successRate = 0;
  if (raw.success_ratio !== undefined || raw.success_rate !== undefined) {
    successRate = parseRate(raw.success_ratio ?? raw.success_rate);
  } else if (totalOrders > 0) {
    successRate = Math.round((delivered / totalOrders) * 1000) / 10;
  }

  // Calculate or pick return rate
  let returnRate = 0;
  if (raw.return_ratio !== undefined || raw.return_rate !== undefined) {
    returnRate = parseRate(raw.return_ratio ?? raw.return_rate);
  } else if (totalOrders > 0) {
    returnRate = Math.round((returned / totalOrders) * 1000) / 10;
  }

  return {
    id,
    name,
    totalOrders,
    delivered,
    cancelled,
    returned,
    successRate,
    returnRate,
    lastActivity: raw.last_delivery || undefined,
  };
}

export function normalizeCourierData(response: RawBdCourierResponse | null): AggregatedCourierData {
  if (!response) {
    return {
      totalOrders: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
      successRate: 0,
      returnRate: 0,
      couriers: [],
    };
  }

  const courierList: CourierStats[] = [];

  // Data can be in response.data or response.courierData
  const rawDataSource = response.data ?? (response as Record<string, unknown>).courierData;

  // Check if summary entry is present inside data.summary
  let summaryEntry: RawCourierEntry | null = null;

  // 1. Check if rawDataSource is an object containing named courier maps (e.g. { steadfast: {...}, pathao: {...} })
  if (rawDataSource && typeof rawDataSource === 'object' && !Array.isArray(rawDataSource)) {
    const dataObj = rawDataSource as Record<string, unknown>;
    for (const [key, rawEntry] of Object.entries(dataObj)) {
      const lowerKey = key.toLowerCase();

      // Skip summary object from courier list
      if (lowerKey === 'summary' || lowerKey === 'total') {
        if (rawEntry && typeof rawEntry === 'object') {
          summaryEntry = rawEntry as RawCourierEntry;
        }
        continue;
      }

      const meta = COURIER_META[lowerKey] || { id: lowerKey, name: key };
      if (rawEntry && typeof rawEntry === 'object') {
        const normalized = normalizeCourierEntry(meta.id, meta.name, rawEntry as RawCourierEntry);
        if (normalized) {
          courierList.push(normalized);
        }
      }
    }
  } else if (Array.isArray(rawDataSource)) {
    // Array of courier records
    for (const item of rawDataSource) {
      if (item && typeof item === 'object') {
        const cName = item.name || item.courier_name || 'Courier';
        const cId = cName.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cId === 'summary' || cId === 'total') {
          summaryEntry = item as RawCourierEntry;
          continue;
        }
        const normalized = normalizeCourierEntry(cId, cName, item);
        if (normalized) {
          courierList.push(normalized);
        }
      }
    }
  } else if (response.couriers && typeof response.couriers === 'object') {
    // Some API versions return `couriers` dictionary
    for (const [key, rawEntry] of Object.entries(response.couriers)) {
      const lowerKey = key.toLowerCase();
      if (lowerKey === 'summary' || lowerKey === 'total') {
        summaryEntry = rawEntry;
        continue;
      }
      const meta = COURIER_META[lowerKey] || { id: lowerKey, name: key };
      const normalized = normalizeCourierEntry(meta.id, meta.name, rawEntry);
      if (normalized) {
        courierList.push(normalized);
      }
    }
  }

  // Calculate Aggregates
  let aggTotal = 0;
  let aggDelivered = 0;
  let aggCancelled = 0;
  let aggReturned = 0;

  // Check top-level or summary entry
  if (summaryEntry) {
    aggTotal = parseNumber(summaryEntry.total_parcel ?? summaryEntry.total_orders ?? summaryEntry.total);
    aggDelivered = parseNumber(summaryEntry.success_parcel ?? summaryEntry.delivered_parcel ?? summaryEntry.delivered);
    const rawCancelled = parseNumber(summaryEntry.cancelled_parcel ?? summaryEntry.cancelled);
    const rawReturned = parseNumber(summaryEntry.returned_parcel ?? summaryEntry.returned);

    if (rawReturned > 0) {
      aggReturned = rawReturned;
      aggCancelled = rawCancelled;
    } else {
      // In BD Courier summary, cancelled_parcel includes returns
      aggReturned = rawCancelled;
      aggCancelled = Math.max(0, aggTotal - aggDelivered - aggReturned);
    }
  } else {
    const topTotal = parseNumber(response.total_parcel ?? response.total_orders);
    const topDelivered = parseNumber(response.success_parcel ?? response.delivered);
    const topCancelled = parseNumber(response.cancelled_parcel ?? response.cancelled);
    const topReturned = parseNumber(response.returned_parcel ?? response.returned);

    if (topTotal > 0 || topDelivered > 0 || topCancelled > 0 || topReturned > 0) {
      aggTotal = topTotal;
      aggDelivered = topDelivered;
      aggCancelled = topCancelled;
      aggReturned = topReturned;
    } else if (courierList.length > 0) {
      // Sum from courier list
      for (const c of courierList) {
        aggTotal += c.totalOrders;
        aggDelivered += c.delivered;
        aggCancelled += c.cancelled;
        aggReturned += c.returned;
      }
    }
  }

  // Calculate overall rates
  let successRate = 0;
  if (summaryEntry?.success_ratio !== undefined) {
    successRate = parseRate(summaryEntry.success_ratio);
  } else if (response.success_ratio !== undefined) {
    successRate = parseRate(response.success_ratio);
  } else if (aggTotal > 0) {
    successRate = Math.round((aggDelivered / aggTotal) * 1000) / 10;
  }

  const returnRate = aggTotal > 0
    ? Math.round((aggReturned / aggTotal) * 1000) / 10
    : 0;

  return {
    totalOrders: aggTotal,
    delivered: aggDelivered,
    cancelled: aggCancelled,
    returned: aggReturned,
    successRate,
    returnRate,
    couriers: courierList,
  };
}
