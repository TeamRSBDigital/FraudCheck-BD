/**
 * BD Courier API adapter.
 *
 * Production rules:
 * - credentials stay server-side
 * - only the explicitly configured API endpoint is called
 * - no silent mock/sandbox fallback in production
 * - demo data is available only when ENABLE_DEMO_MODE=true
 */

import { RawBdCourierResponse } from './types';

export type CourierApiErrorCode =
  | 'CONFIGURATION'
  | 'AUTH'
  | 'RATE_LIMIT'
  | 'TIMEOUT'
  | 'UPSTREAM'
  | 'INVALID_RESPONSE';

export class CourierApiError extends Error {
  readonly code: CourierApiErrorCode;
  readonly status?: number;

  constructor(code: CourierApiErrorCode, message: string, status?: number) {
    super(message);
    this.name = 'CourierApiError';
    this.code = code;
    this.status = status;
  }
}

export interface CourierHistoryResult {
  raw: RawBdCourierResponse | null;
  isMock: boolean;
  notice?: string;
}

function cleanEnv(value: string | undefined): string {
  return value ? value.replace(/^["']|["']$/g, '').trim() : '';
}

function isEnabled(value: string | undefined): boolean {
  return ['1', 'true', 'yes', 'on'].includes(cleanEnv(value).toLowerCase());
}

export class BdCourierClient {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly authHeader: string;
  private readonly authScheme: string;
  private readonly phoneField: string;
  private readonly apiKeyLocation: 'header' | 'body';
  private readonly apiKeyField: string;
  private readonly timeoutMs: number;
  private readonly demoMode: boolean;

  constructor() {
    this.apiUrl = cleanEnv(process.env.BDCOURIER_API_URL);
    this.apiKey = cleanEnv(process.env.BDCOURIER_API_KEY);
    this.authHeader = cleanEnv(process.env.BDCOURIER_AUTH_HEADER) || 'Authorization';
    this.authScheme = cleanEnv(process.env.BDCOURIER_AUTH_SCHEME) || 'Bearer';
    this.phoneField = cleanEnv(process.env.BDCOURIER_PHONE_FIELD) || 'phone';
    this.apiKeyField = cleanEnv(process.env.BDCOURIER_API_KEY_FIELD) || 'api_key';
    this.apiKeyLocation =
      cleanEnv(process.env.BDCOURIER_API_KEY_LOCATION).toLowerCase() === 'body'
        ? 'body'
        : 'header';

    const configuredTimeout = Number.parseInt(cleanEnv(process.env.BDCOURIER_TIMEOUT_MS), 10);
    this.timeoutMs = Number.isFinite(configuredTimeout) && configuredTimeout >= 1000
      ? Math.min(configuredTimeout, 15000)
      : 8000;

    this.demoMode = isEnabled(process.env.ENABLE_DEMO_MODE);
  }

  private buildRequest(phone: string): { headers: Record<string, string>; body: string } {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'FraudCheck-BD/2.0',
    };

    const payload: Record<string, string> = {
      [this.phoneField]: phone,
    };

    if (this.apiKeyLocation === 'body') {
      payload[this.apiKeyField] = this.apiKey;
    } else {
      headers[this.authHeader] = this.authScheme
        ? `${this.authScheme} ${this.apiKey}`
        : this.apiKey;
    }

    return {
      headers,
      body: JSON.stringify(payload),
    };
  }

  async getCourierHistory(phone: string): Promise<CourierHistoryResult> {
    if (this.demoMode) {
      return {
        raw: getSandboxProfile(phone),
        isMock: true,
        notice: 'Demo mode is enabled. This report uses simulated courier data and must not be used for a real customer decision.',
      };
    }

    if (!this.apiUrl) {
      throw new CourierApiError(
        'CONFIGURATION',
        'BD Courier API endpoint is not configured. Set BDCOURIER_API_URL from the official API documentation.'
      );
    }

    if (!this.apiKey) {
      throw new CourierApiError(
        'CONFIGURATION',
        'BD Courier API key is not configured. Add BDCOURIER_API_KEY to the server environment.'
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(this.apiUrl);
    } catch {
      throw new CourierApiError('CONFIGURATION', 'BDCOURIER_API_URL is not a valid URL.');
    }

    if (parsedUrl.protocol !== 'https:') {
      throw new CourierApiError('CONFIGURATION', 'BD Courier API endpoint must use HTTPS.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const request = this.buildRequest(phone);
      const response = await fetch(parsedUrl.toString(), {
        method: 'POST',
        headers: request.headers,
        body: request.body,
        signal: controller.signal,
        redirect: 'error',
      });

      if (response.status === 404) {
        return { raw: null, isMock: false };
      }

      if (response.status === 401 || response.status === 403) {
        throw new CourierApiError(
          'AUTH',
          'BD Courier rejected the API credentials or the account does not have API access.',
          response.status
        );
      }

      if (response.status === 429) {
        throw new CourierApiError(
          'RATE_LIMIT',
          'BD Courier API rate limit reached. Please try again shortly.',
          response.status
        );
      }

      if (!response.ok) {
        throw new CourierApiError(
          'UPSTREAM',
          `BD Courier API returned HTTP ${response.status}.`,
          response.status
        );
      }

      let data: RawBdCourierResponse;
      try {
        data = (await response.json()) as RawBdCourierResponse;
      } catch {
        throw new CourierApiError(
          'INVALID_RESPONSE',
          'BD Courier API returned an invalid JSON response.'
        );
      }

      if (!data || typeof data !== 'object') {
        throw new CourierApiError(
          'INVALID_RESPONSE',
          'BD Courier API returned an empty or invalid response.'
        );
      }

      const message = typeof data.message === 'string' ? data.message.trim() : '';
      const messageLower = message.toLowerCase();
      const statusValue = String(data.status ?? '').toLowerCase();
      const reportsFailure =
        data.success === false ||
        ['error', 'failed', 'fail', 'unauthorized', 'forbidden'].includes(statusValue);

      if (reportsFailure) {
        if (
          messageLower.includes('unauthorized') ||
          messageLower.includes('forbidden') ||
          messageLower.includes('api key') ||
          messageLower.includes('token') ||
          messageLower.includes('subscription')
        ) {
          throw new CourierApiError('AUTH', message || 'BD Courier API authorization failed.');
        }

        if (
          messageLower.includes('not found') ||
          messageLower.includes('no data') ||
          messageLower.includes('no record')
        ) {
          return { raw: null, isMock: false };
        }

        throw new CourierApiError(
          'UPSTREAM',
          message || 'BD Courier API reported an unsuccessful request.'
        );
      }

      return { raw: data, isMock: false };
    } catch (error: unknown) {
      if (error instanceof CourierApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new CourierApiError(
          'TIMEOUT',
          `BD Courier API did not respond within ${this.timeoutMs}ms.`
        );
      }

      throw new CourierApiError(
        'UPSTREAM',
        'Could not connect to the BD Courier API.'
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  public getSandboxProfile(phone: string): RawBdCourierResponse | null {
    if (!this.demoMode) {
      throw new CourierApiError(
        'CONFIGURATION',
        'Sandbox profiles are disabled. Set ENABLE_DEMO_MODE=true only for development or demos.'
      );
    }
    return getSandboxProfile(phone);
  }
}

/**
 * Deterministic demo data. Never used unless ENABLE_DEMO_MODE=true.
 */
export function getSandboxProfile(phone: string): RawBdCourierResponse | null {
  if (phone.endsWith('00') || phone.endsWith('99')) {
    return {
      status: 'success',
      phone,
      total_parcel: 0,
      success_parcel: 0,
      cancelled_parcel: 0,
      returned_parcel: 0,
      success_ratio: 0,
      data: {},
    };
  }

  const highRisk = ['77', '88', '89', '13'].some((suffix) => phone.endsWith(suffix));

  if (highRisk) {
    return {
      status: 'success',
      phone,
      total_parcel: 51,
      success_parcel: 34,
      cancelled_parcel: 5,
      returned_parcel: 12,
      success_ratio: 66.7,
      data: {
        pathao: {
          name: 'Pathao',
          total_parcel: 24,
          success_parcel: 18,
          returned_parcel: 4,
          cancelled_parcel: 2,
          success_ratio: 75,
        },
        steadfast: {
          name: 'SteadFast',
          total_parcel: 15,
          success_parcel: 8,
          returned_parcel: 5,
          cancelled_parcel: 2,
          success_ratio: 53.3,
        },
        redx: {
          name: 'RedX',
          total_parcel: 8,
          success_parcel: 5,
          returned_parcel: 2,
          cancelled_parcel: 1,
          success_ratio: 62.5,
        },
        paperfly: {
          name: 'Paperfly',
          total_parcel: 4,
          success_parcel: 3,
          returned_parcel: 1,
          cancelled_parcel: 0,
          success_ratio: 75,
        },
      },
    };
  }

  return {
    status: 'success',
    phone,
    total_parcel: 32,
    success_parcel: 30,
    cancelled_parcel: 1,
    returned_parcel: 1,
    success_ratio: 93.8,
    data: {
      steadfast: {
        name: 'SteadFast',
        total_parcel: 14,
        success_parcel: 13,
        returned_parcel: 1,
        cancelled_parcel: 0,
        success_ratio: 92.9,
      },
      pathao: {
        name: 'Pathao',
        total_parcel: 12,
        success_parcel: 12,
        returned_parcel: 0,
        cancelled_parcel: 0,
        success_ratio: 100,
      },
      redx: {
        name: 'RedX',
        total_parcel: 4,
        success_parcel: 3,
        returned_parcel: 0,
        cancelled_parcel: 1,
        success_ratio: 75,
      },
      carrybee: {
        name: 'CarryBee',
        total_parcel: 2,
        success_parcel: 2,
        returned_parcel: 0,
        cancelled_parcel: 0,
        success_ratio: 100,
      },
    },
  };
}
