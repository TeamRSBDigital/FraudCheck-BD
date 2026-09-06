/**
 * Core type definitions for FraudCheck BD
 */

export type RiskLevel = 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK' | 'NO DATA';

export interface CourierStats {
  id: string;
  name: string;
  totalOrders: number;
  delivered: number;
  cancelled: number;
  returned: number;
  successRate: number; // percentage 0 - 100
  returnRate: number;  // percentage 0 - 100
  lastActivity?: string;
}

export interface AggregatedCourierData {
  totalOrders: number;
  delivered: number;
  cancelled: number;
  returned: number;
  successRate: number;
  returnRate: number;
  couriers: CourierStats[];
}

export interface RiskIndicator {
  type: 'positive' | 'neutral' | 'warning' | 'negative';
  label: string;
  description: string;
}

export interface RiskAssessment {
  score: number; // 0 (safest) to 100 (highest risk)
  level: RiskLevel;
  verdictTitle: string;
  summary: string;
  indicators: RiskIndicator[];
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  disclaimer: string;
}

export interface PhoneCheckRequest {
  phone: string;
}

export interface PhoneCheckResponse {
  success: boolean;
  maskedPhone: string;
  queryTimestamp: string;
  hasData: boolean;
  data?: AggregatedCourierData;
  risk?: RiskAssessment;
  rateLimit: {
    limit: number;
    remaining: number;
    resetTimestamp: number;
  };
  isMockData?: boolean;
  error?: string;
  message?: string;
}

export interface RateLimitStatus {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // unix timestamp in ms
}
