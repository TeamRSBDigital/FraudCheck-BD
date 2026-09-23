/**
 * Production BD Courier API adapter.
 *
 * This module contains no demo, mock, sandbox, or offline fallback path.
 * Every successful report must come from the configured live courier API.
 */

import type { RawBdCourierResponse } from './types.js';

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
  providerStatus: 'live';
}

function cleanEnv(value: string | undefined): string {
  return value ? value.replace(/^["']|["']$/g, '').trim() : '';
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

    const configuredTimeout = Number.parseInt(
      cleanEnv(process.env.BDCOURIER_TIMEOUT_MS),
      10
    );

    this.timeoutMs =
      Number.isFinite(configuredTimeout) && configuredTimeout >= 1000
        ? Math.min(configuredTimeout, 15000)
        : 8000;
  }

  isConfigured(): boolean {
    return Boolean(this.apiUrl && this.apiKey);
  }

  private getApiUrl(): URL {
    if (!this.apiUrl) {
      throw new CourierApiError(
        'CONFIGURATION',
        'BD Courier API endpoint is not configured.'
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(this.apiUrl);
    } catch {
      throw new CourierApiError(
        'CONFIGURATION',
        'BDCOURIER_API_URL is not a valid URL.'
      );
    }

    if (parsedUrl.protocol !== 'https:') {
      throw new CourierApiError(
        'CONFIGURATION',
        'BD Courier API endpoint must use HTTPS.'
      );
    }

    return parsedUrl;
  }

  private buildRequest(phone: string): {
    headers: Record<string, string>;
    body: string;
  } {
    if (!this.apiKey) {
      throw new CourierApiError(
        'CONFIGURATION',
        'BD Courier API key is not configured.'
      );
    }

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
    const apiUrl = this.getApiUrl();
    const request = this.buildRequest(phone);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(apiUrl.toString(), {
        method: 'POST',
        headers: request.headers,
        body: request.body,
        signal: controller.signal,
        redirect: 'error',
        cache: 'no-store',
      });

      if (response.status === 404) {
        return {
          raw: null,
          providerStatus: 'live',
        };
      }

      if (response.status === 401 || response.status === 403) {
        throw new CourierApiError(
          'AUTH',
          'BD Courier rejected the configured API credentials.',
          response.status
        );
      }

      if (response.status === 429) {
        throw new CourierApiError(
          'RATE_LIMIT',
          'BD Courier API rate limit reached.',
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
          'BD Courier API returned invalid JSON.'
        );
      }

      if (!data || typeof data !== 'object') {
        throw new CourierApiError(
          'INVALID_RESPONSE',
          'BD Courier API returned an empty or invalid response.'
        );
      }

      const message =
        typeof data.message === 'string' ? data.message.trim() : '';
      const messageLower = message.toLowerCase();
      const statusValue = String(data.status ?? '').toLowerCase();

      const reportsFailure =
        data.success === false ||
        ['error', 'failed', 'fail', 'unauthorized', 'forbidden'].includes(
          statusValue
        );

      if (reportsFailure) {
        if (
          messageLower.includes('unauthorized') ||
          messageLower.includes('forbidden') ||
          messageLower.includes('api key') ||
          messageLower.includes('token') ||
          messageLower.includes('subscription')
        ) {
          throw new CourierApiError(
            'AUTH',
            message || 'BD Courier API authorization failed.'
          );
        }

        if (
          messageLower.includes('not found') ||
          messageLower.includes('no data') ||
          messageLower.includes('no record')
        ) {
          return {
            raw: null,
            providerStatus: 'live',
          };
        }

        throw new CourierApiError(
          'UPSTREAM',
          message || 'BD Courier API reported an unsuccessful request.'
        );
      }

      return {
        raw: data,
        providerStatus: 'live',
      };
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
}
