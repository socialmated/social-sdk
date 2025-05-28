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
   * Signs a request using the specified resource and body.
   *
   * @param resource - The API resource to be signed, e.g., '/api/v1/resource?param=value'.
   * @param body - The request body.
   * @param options - Optional signing options.
   * @returns A promise that resolves to the signed output.
   */
  public sign(resource: string, body: unknown, options?: XhsSignerOptions): Promise<XhsSignOutput>;
  /**
   * Signs a request using the provided `got` options.
   *
   * @param opts - The `got` request options.
   * @param options - Optional signing options.
   * @returns A promise that resolves to the signed output.
   */
  public sign(opts: Options, options?: XhsSignerOptions): Promise<XhsSignOutput>;
  /**
   * Signs a request using the provided `fetch` request.
   *
   * @param req - The `fetch` request object.
   * @param options - Optional signing options.
   * @returns A promise that resolves to the signed output.
   */
  // eslint-disable-next-line @typescript-eslint/unified-signatures -- explicitly overload
  public sign(req: Request, options?: XhsSignerOptions): Promise<XhsSignOutput>;
  public async sign(arg1: string | Options | Request, arg2?: unknown, arg3?: XhsSignerOptions): Promise<XhsSignOutput> {
    let resource: string;
    let body: unknown;
    let options: XhsSignerOptions | undefined;
    if (typeof arg1 === 'string') {
      resource = arg1;
      body = arg2;
      options = arg3;
    } else {
      resource = arg1.url ? new URL(arg1.url).pathname + new URL(arg1.url).search : '';
      body = typeof arg1.json === 'function' ? await (arg1.json as () => Promise<unknown>)() : arg1.json;
      options = arg2 as XhsSignerOptions | undefined;
    }

    let output: Omit<XhsSignOutput, 'X-Mns'>;
    if (options?.type === 'sign_old') {
      output = signOld(resource, body);
    } else {
      output = signNew(resource, body, this.a1);
    }

    return {
      ...output,
      'X-Mns': options?.mns ? generateMns(resource, body) : 'unload',
    };
  }
}

export { XhsSigner };
export type { XhsSignerOptions };
