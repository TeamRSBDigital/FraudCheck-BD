/**
 * BD Courier API Adapter
 * Secure server-side client to interact with the BD Courier API (api.bdcourier.com).
 * Includes an isolated development sandbox for testing when credentials are not yet supplied.
 */

import { RawBdCourierResponse } from './types';

export class BdCourierClient {
  private readonly apiUrl: string;
  private readonly apiKey: string | undefined;

  constructor() {
    this.apiUrl = process.env.BDCOURIER_API_URL || 'https://api.bdcourier.com/courier-check';
    this.apiKey = process.env.BDCOURIER_API_KEY?.trim();
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
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'api-key': this.apiKey, // some endpoints use header api-key
          },
          body: JSON.stringify({
            phone: phone,
            phone_number: phone,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Log server-side warning without leaking tokens
          console.warn(`[BDCourier] API responded with status ${response.status}`);
          if (response.status === 404) {
            return { raw: null, isMock: false };
          }
          throw new Error(`Courier provider returned status ${response.status}`);
        }

        const data = await response.json() as RawBdCourierResponse;
        return { raw: data, isMock: false };
      } catch (err: unknown) {
        const isAbort = err instanceof Error && err.name === 'AbortError';
        console.error('[BDCourier] Request failed:', isAbort ? 'Timeout after 8s' : 'Network/API error');
        throw new Error('Unable to connect to courier verification service.');
      }
    }

    // Development / Sandbox mode:
    // Explicitly isolated for testing risk engines and UI states when no production API key is configured.
    console.info(`[BDCourier Sandbox] No BDCOURIER_API_KEY set. Serving deterministic sandbox profile for ${phone.slice(0, 3)}***${phone.slice(-2)}`);
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

    // Profile 2: High Risk (numbers ending in 88, 89, 77, 13 or high odd numbers)
    // E.g. ~35% success rate, high return rate (12 returned out of 51)
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
    // Moderate history, some returns / cancellation
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
    // E.g. 28 delivered out of 30, only 1 return
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
