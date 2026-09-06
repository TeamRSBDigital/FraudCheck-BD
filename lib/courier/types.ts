/**
 * BD Courier API & Provider Types
 */

import { AggregatedCourierData, CourierStats } from '../../src/types/index';

export interface RawCourierEntry {
  name?: string;
  courier_name?: string;
  total_parcel?: number;
  total_orders?: number;
  total?: number;
  success_parcel?: number;
  delivered_parcel?: number;
  delivered?: number;
  success?: number;
  cancelled_parcel?: number;
  cancelled?: number;
  returned_parcel?: number;
  returned?: number;
  success_ratio?: number;
  success_rate?: number;
  return_ratio?: number;
  return_rate?: number;
  last_delivery?: string;
}

export interface RawBdCourierResponse {
  status?: string | number | boolean;
  success?: boolean;
  message?: string;
  phone?: string;
  phone_number?: string;
  total_parcel?: number;
  total_orders?: number;
  success_parcel?: number;
  delivered?: number;
  cancelled_parcel?: number;
  cancelled?: number;
  returned_parcel?: number;
  returned?: number;
  success_ratio?: number;
  risk_level?: string;
  data?: {
    steadfast?: RawCourierEntry;
    pathao?: RawCourierEntry;
    redx?: RawCourierEntry;
    paperfly?: RawCourierEntry;
    courierfast?: RawCourierEntry;
    carrybee?: RawCourierEntry;
    [key: string]: RawCourierEntry | unknown;
  } | RawCourierEntry[];
  couriers?: Record<string, RawCourierEntry>;
}

export interface CourierAdapter {
  fetchCourierHistory(phone: string): Promise<{
    raw: RawBdCourierResponse | null;
    isMock: boolean;
  }>;
}
