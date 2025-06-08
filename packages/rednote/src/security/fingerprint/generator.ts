import { type Options } from 'got';
import { gotScraping } from '@social-sdk/client/http';
import { xsCommon } from './fingerprint.js';
import { type RednoteCookieSession } from '@/auth/session.js';
import { type ApiResponse } from '@/types/common.js';
import { type SbtSource } from '@/types/security.js';

/**
 * XSCommonGenerator is responsible for generating a common fingerprint signature
 * used for security and anti-abuse mechanisms in the Xiaohongshu (XHS) platform.
 *
 * @example
 * ```typescript
 * const generator = new XSCommonGenerator(session);
 * const signature = generator.generate(config, requestOptions);
 * ```
 *
 * @public
 */
export class XSCommonGenerator {
  /**
   * Creates an instance of the fingerprint generator.
   *
   * @param session - The current Rednote cookie session used for fingerprint generation.
   * @param commonPatterns - An optional array of common API endpoint patterns that should trigger fingerprint generation.
   */
  constructor(
    private session: RednoteCookieSession,
    private commonPatterns: (string | RegExp)[],
  ) {}

  /**
   * Retrieves the current signature count from session storage.
   * Optionally increments the count before returning it.
   *
   * @param increment - If true, increments the signature count before returning.
   * @returns The current (or incremented) signature count as a number.
   */
  private getSigCount(increment?: boolean): number {
    const sessionStorage = this.session.sessionStorage;
    const key = 'sc';

    let count = Number(sessionStorage.getItem(key)) || 0;
    if (increment) {
      count++;
      sessionStorage.setItem(key, String(count));
    }
    return count;
  }

  /**
   * Updates the `commonPatterns` array with the provided patch values.
   *
   * @param patch - An array of string patterns to be added to `commonPatterns`.
   * @returns A Promise that resolves when the operation is complete.
   */
  private async pushXsCommon(): Promise<void> {
    const sbtSource = await gotScraping
      .post('https://as.xiaohongshu.com/api/sec/v1/sbtsource', {
        headers: {
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
      })
      .json<ApiResponse<SbtSource>>();

    const commonPatch = sbtSource.data?.commonPatch.length
      ? sbtSource.data.commonPatch
      : ['api/sec/v1/shield/webprofile'];

    commonPatch.forEach((c) => {
      this.commonPatterns.push(c);
    });
  }

  /**
   * Generates a fingerprint string based on the provided client configuration and request options.
   *
   * @param config - The client configuration object containing platform information.
   * @param request - The request options, including URL and headers.
   * @returns The generated fingerprint string, or `null` if the URL does not match path patterns.
   */
  public generate(platform: string, request: Options): string | null {
    const localStorage = this.session.localStorage;

    const url = request.url ? request.url.toString() : '';
    if (!this.commonPatterns.map((p) => new RegExp(p)).some((pattern) => pattern.test(url))) {
      return null;
    }

    const xt = (request.headers['X-t'] ?? '') as string;
    const xs = (request.headers['X-s'] ?? '') as string;
    const xSign = (request.headers['X-sign'] ?? '') as string;

    const shouldIncrement = Boolean((xt && xs) || xSign);
    const sc = this.getSigCount(shouldIncrement);

    const a1 = this.session.get('a1') ?? '';
    const b1 = localStorage.getItem('b1') ?? '';
    const b1b1 = localStorage.getItem('b1b1') ?? '1';

    return xsCommon(platform, a1, b1, b1b1, sc);
  }
}
