import { type CookieSession } from '@social-sdk/core/auth/session';
import { type Options } from 'got';
import { type Signer } from '@social-sdk/core/security';
import { generateLocalId } from '../token/token.js';
import { signOld, signNew, generateMns, type XhsSignOutput } from './sign.js';
import { defaultConfig } from '@/client/config.js';

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
   * The `a1` cookie value.
   */
  private a1: string;

  /**
   * Creates an instance of `XhsSigner`.
   * @param a1 - The `a1` cookie value used for signing requests.
   */
  constructor(a1?: string) {
    this.a1 = a1 ?? generateLocalId(defaultConfig.platform);
  }

  /**
   * Creates an instance of `XhsSigner` from a given session.
   *
   * @param session - The `CookieSession` object containing authentication cookies.
   * @returns An instance of `XhsSigner` initialized with the `a1` cookie value from the session.
   * @throws If the session does not contain an `a1` cookie.
   */
  public static fromSession(session: CookieSession): XhsSigner {
    const a1 = session.get('a1');
    if (!a1) {
      throw new Error('Session does not contain a1 cookie');
    }

    return new XhsSigner(a1);
  }

  /**
   * Generates a signature for the given request.
   *
   * @param request - The request options.
   * @param options - Optional parameters for signing, including type and MNS support.
   * @returns An object containing the signed headers, including 'X-s', 'X-t', and 'X-Mns'.
   */
  public sign(request: Options, options?: XhsSignerOptions): XhsSignOutput {
    const fullPath = request.url ? new URL(request.url).pathname + new URL(request.url).search : '';
    const body: unknown =
      !request.json && typeof request.body === 'string' ? JSON.parse(request.body) : (request.json ?? request.body);
    let output: Omit<XhsSignOutput, 'X-Mns'>;

    if (options?.type === 'sign_old') {
      output = signOld(fullPath, body);
    } else {
      output = signNew(fullPath, body, this.a1);
    }

    return {
      ...output,
      'X-Mns': options?.mns ? generateMns(fullPath, body) : 'unload',
    };
  }
}

export { XhsSigner };
export type { XhsSignerOptions };
