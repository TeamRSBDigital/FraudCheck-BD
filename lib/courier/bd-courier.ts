/**
 * BD Courier API Adapter
 * Secure server-side client to interact with the BD Courier API.
 * Handles endpoint normalization, automatic fallback, and robust error handling.
 */

import { RawBdCourierResponse } from './types';

export class BdCourierClient {
  private readonly configuredUrl: string | undefined;
  private readonly apiKey: string | undefined;

  constructor() {
    this.configuredUrl = process.env.BDCOURIER_API_URL?.trim();
    this.apiKey = process.env.BDCOURIER_API_KEY?.trim();
  }

  /**
   * Resolves possible candidate API endpoints in priority order.
   * Handles situations where user sets only the domain (e.g. https://api.bdcourier.com)
   * or full path (e.g. https://api.bdcourier.com/courier-check).
   */
  private getCandidateEndpoints(): string[] {
    const endpoints: string[] = [];

    if (this.configuredUrl) {
      let trimmed = this.configuredUrl.replace(/\/+$/, '');
      if (trimmed.includes('/courier-check') || trimmed.includes('/check-courier-info')) {
        endpoints.push(trimmed);
      } else if (trimmed.includes('api.bdcourier.com')) {
        endpoints.push(`${trimmed}/courier-check`);
      } else if (trimmed.includes('bdcourier.com')) {
        endpoints.push(`${trimmed}/api/courier-check`);
      } else {
        endpoints.push(`${trimmed}/courier-check`);
      }
    }

    // Default primary and secondary endpoints
    const defaults = [
      'https://api.bdcourier.com/courier-check',
      'https://bdcourier.com/api/courier-check',
    ];

    for (const d of defaults) {
      if (!endpoints.includes(d)) {
        endpoints.push(d);
      }
    }

    return endpoints;
  }

  /**
   * Fetches courier delivery records for the given normalized phone number.
   * Ensures zero credential leakage to client.
   */
  async getCourierHistory(phone: string): Promise<{
    raw: RawBdCourierResponse | null;
    isMock: boolean;
  }> {
    // If API Key is configured, make the live authenticated request
    if (this.apiKey && this.apiKey !== 'demo' && !this.apiKey.startsWith('PLACEHOLDER')) {
      const endpoints = this.getCandidateEndpoints();
      let lastError: Error | null = null;

      for (const endpoint of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout for cross-network query

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
              'api-key': this.apiKey,
            },
            body: JSON.stringify({
              phone: phone,
              phone_number: phone,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            console.warn(`[BDCourier] Endpoint ${endpoint} returned HTTP ${response.status}`);

            if (response.status === 404) {
              // Valid lookup with no courier records found
              return { raw: null, isMock: false };
            }

            if (response.status === 401 || response.status === 403) {
              throw new Error('Unauthorized: Invalid or expired BD Courier API key. Please check your credentials in Settings.');
            }

            if (response.status === 429) {
              throw new Error('Upstream BD Courier rate limit exceeded. Please wait a moment before trying again.');
            }

            // 405 (Method Not Allowed) means wrong subpath on this candidate; try next endpoint
            if (response.status === 405) {
              continue;
            }

            throw new Error(`Courier provider service returned HTTP ${response.status}`);
          }

          const data = await response.json() as RawBdCourierResponse;

          // Some API endpoints return { status: 'error', message: '...' } with 200 HTTP code
          if (data && typeof data === 'object' && data.status === 'error' && data.message) {
            const msg = String(data.message).toLowerCase();
            if (msg.includes('token') || msg.includes('unauthorized') || msg.includes('api key')) {
              throw new Error('Unauthorized: Invalid or expired BD Courier API key. Please check your credentials in Settings.');
            }
            if (msg.includes('not found') || msg.includes('no data') || msg.includes('no record')) {
              return { raw: null, isMock: false };
            }
          }

          return { raw: data, isMock: false };
        } catch (err: unknown) {
          const isAbort = err instanceof Error && err.name === 'AbortError';
          const errMsg = err instanceof Error ? err.message : String(err);
          console.warn(`[BDCourier] Failed calling ${endpoint}:`, isAbort ? 'Request timed out after 12s' : errMsg);
          lastError = err instanceof Error ? err : new Error(errMsg);

          // If unauthorized, do not retry other endpoints with the same bad token
          if (errMsg.includes('Unauthorized')) {
            throw lastError;
          }
        }
      }

      // If all live endpoints failed, throw the descriptive error
      if (lastError) {
        console.error('[BDCourier] All candidate endpoints failed. Last error:', lastError.message);
        throw lastError;
      }
    }

    // Development / Sandbox mode:
    // Explicitly isolated for testing risk engines and UI states when no production API key is configured.
    console.info(`[BDCourier Sandbox] Serving deterministic profile for ${phone.slice(0, 3)}***${phone.slice(-2)}`);
    const mockData = this.getSandboxProfile(phone);
    return {
      raw: mockData,
      isMock: true,
    };
  }

  /**
   * Deterministic sandbox data generator based on phone number patterns.
   * Useful for testing all 4 primary UI states: Low Risk, Medium Risk, High Risk, No Data.
   */
  private getSandboxProfile(phone: string): RawBdCourierResponse | null {
    // Profile 1: No Data (numbers ending in 00, 99, or containing all zeroes)
    if (phone.endsWith('00') || phone.endsWith('99') || phone === '01700000000') {
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

    // Profile 2: High Risk (numbers ending in 88, 89, 77, 13)
    if (phone.endsWith('88') || phone.endsWith('89') || phone.endsWith('77') || phone.endsWith('13')) {
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
            success_ratio: 75.0,
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
            success_ratio: 75.0,
          },
        },
      };
    }

    // Profile 3: Medium Risk (numbers ending in 55, 44, 33, 42)
    if (phone.endsWith('55') || phone.endsWith('44') || phone.endsWith('33') || phone.endsWith('42')) {
      return {
        status: 'success',
        phone,
        total_parcel: 14,
        success_parcel: 10,
        cancelled_parcel: 2,
        returned_parcel: 2,
        success_ratio: 71.4,
        data: {
          steadfast: {
            name: 'SteadFast',
            total_parcel: 8,
            success_parcel: 6,
            returned_parcel: 1,
            cancelled_parcel: 1,
            success_ratio: 75.0,
          },
          pathao: {
            name: 'Pathao',
            total_parcel: 6,
            success_parcel: 4,
            returned_parcel: 1,
            cancelled_parcel: 1,
            success_ratio: 66.7,
          },
        },
      };
    }

    // Profile 4: Low Risk / Safe (default profile, high delivery success rate)
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
          success_ratio: 100.0,
        },
        redx: {
          name: 'RedX',
          total_parcel: 4,
          success_parcel: 3,
          returned_parcel: 0,
          cancelled_parcel: 1,
          success_ratio: 75.0,
        },
        carrybee: {
          name: 'CarryBee',
          total_parcel: 2,
          success_parcel: 2,
          returned_parcel: 0,
          cancelled_parcel: 0,
          success_ratio: 100.0,
        },
      },
    };
  }
}
