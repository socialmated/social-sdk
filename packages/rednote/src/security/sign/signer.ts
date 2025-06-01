import { type Options } from 'got';
import { type Signer } from '@social-sdk/core/security';
import { signOld, signNew, generateMns, type XhsSignOutput } from './sign.js';
import { type RednoteCookieSession } from '@/auth/session.js';

/**
 * The output type for the XHS signing process.
 */
interface XhsSignerOptions {
  /**
   * The type of signing to perform.
   */
  type?: 'sign_new' | 'sign_old';

  /**
   * Whether MNS is supported.
   */
  mns?: boolean;
}

/**
 * The `XhsSigner` class provides methods to sign requests for the Xiaohongshu (XHS) API.
 *
 * @example
 * ```typescript
 * const signer = XhsSigner.fromSession(session);
 * const signature = await signer.sign('/api/resource', requestBody, { type: 'sign_new' });
 * ```
 */
class XhsSigner implements Signer<{ 'X-s': string; 'X-t': string; 'X-Mns': string }> {
  /**
   * Creates an instance of `XhsSigner`.
   * @param session - The `RednoteCookieSession` object containing authentication cookies.
   */
  constructor(private session: RednoteCookieSession) {}

  /**
   * Generates a signature for the given request.
   *
   * @param request - The request options.
   * @param options - Optional parameters for signing, including type and MNS support.
   * @returns An object containing the signed headers, including 'X-s', 'X-t', and 'X-Mns'.
   */
  public sign(request: Options, options?: XhsSignerOptions): XhsSignOutput {
    const a1 = this.session.get('a1') ?? this.session.refresh('a1');
    const fullPath = request.url ? new URL(request.url).pathname + new URL(request.url).search : '';
    const body: unknown =
      !request.json && typeof request.body === 'string' ? JSON.parse(request.body) : (request.json ?? request.body);
    let output: Omit<XhsSignOutput, 'X-Mns'>;

    if (options?.type === 'sign_old') {
      output = signOld(fullPath, body);
    } else {
      output = signNew(fullPath, body, a1);
    }

    return {
      ...output,
      'X-Mns': options?.mns ? generateMns(fullPath, body) : 'unload',
    };
  }
}

export { XhsSigner };
export type { XhsSignerOptions };
