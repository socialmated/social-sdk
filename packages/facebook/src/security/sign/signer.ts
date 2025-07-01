import { type Signer } from '@social-sdk/client/security';
import { type Options } from '@social-sdk/client/http';
import { generateProof, type AppSecretProof } from './sign.js';

/**
 * Signer for Facebook's App Secret Proof.
 * @see {@link https://developers.facebook.com/docs/facebook-login/security#proof | Facebook Login - Login Security}
 *
 * @example
 * ```typescript
 * const signer = new AppSecretProofSigner('your_app_secret');
 * const proof = signer.sign({
 *   url: 'https://graph.facebook.com/v12.0/me?access_token=your_access_token',
 * });
 * console.log(proof);
 * ```
 */
export class AppSecretProofSigner implements Signer<AppSecretProof> {
  /**
   * Creates an instance of AppSecretProofSigner.
   *
   * @param appSecret - The App Secret of your Facebook application.
   */
  constructor(private readonly appSecret: string) {}

  /**
   * Generates the App Secret Proof for a given request.
   *
   * @param req - The request options containing the access token.
   * @throws Error if the access token is not provided in the request.
   * @returns The generated App Secret Proof.
   */
  public sign(req: Options): AppSecretProof {
    let accessToken: string | null = null;

    if (req.url) {
      const params = new URL(req.url).searchParams;
      if (params.has('access_token')) {
        accessToken = params.get('access_token');
      }
    }

    if (typeof req.searchParams === 'string' || req.searchParams instanceof URLSearchParams) {
      const params = new URLSearchParams(req.searchParams);
      if (params.has('access_token')) {
        accessToken = params.get('access_token');
      }
    } else if (req.searchParams && 'access_token' in req.searchParams) {
      accessToken = (req.searchParams['access_token'] ?? null) as string | null;
    }

    if (!accessToken) {
      throw new Error('Access token is required to generate App Secret Proof');
    }

    return generateProof(this.appSecret, accessToken);
  }
}
