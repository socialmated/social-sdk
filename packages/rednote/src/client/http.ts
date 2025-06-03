import { createCookieHttpClient, type PrivateHttpClient } from '@social-sdk/core/client';
import { debug } from '@social-sdk/core/hooks';
import { defaultCommonPatterns } from './config.js';
import { type RednoteCookieSession } from '@/auth/session.js';
import { XSCommonGenerator } from '@/security/fingerprint/generator.js';
import { XhsSigner } from '@/security/sign/signer.js';
import { addFingerprint, setupTracing, signRequest } from '@/hooks/request.js';
import { retryOnUnauthorized } from '@/hooks/response.js';

/**
 * Creates an HTTP client configured for making requests to Rednote (Xiaohongshu) API endpoints.
 *
 * @param session - The authenticated cookie session containing user credentials and tokens.
 * @returns A configured HttpClient instance ready for making authenticated requests to Rednote API.
 */
function createRednoteHttpClient(session: RednoteCookieSession): PrivateHttpClient {
  const http = createCookieHttpClient(session);
  const signer = new XhsSigner(session);
  const generator = new XSCommonGenerator(session, defaultCommonPatterns);

  return http.extend({
    headers: {
      origin: 'https://www.xiaohongshu.com',
      referer: 'https://www.xiaohongshu.com/',
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json;charset=UTF-8',
      'sec-fetch-site': 'same-site',
    },
    sessionToken: {
      a1: session.get('a1'),
      webId: session.get('webId'),
    },
    hooks: {
      beforeRequest: [signRequest(signer), addFingerprint(generator), setupTracing, debug],
      afterResponse: [retryOnUnauthorized(session), debug],
    },
  });
}

/**
 * The API endpoints of Rednote (Xiaohongshu).
 */
enum RednoteAPIEndpoints {
  /**
   * The base URL for Rednote's security API endpoints.
   */
  SecV1 = 'https://as.xiaohongshu.com/api/sec/v1/',
  /**
   * The base URL for Rednote's SNS Web V1 API endpoints.
   */
  SnsWebV1 = 'https://edith.xiaohongshu.com/api/sns/web/v1/',
  /**
   * The base URL for Rednote's SNS Web V2 API endpoints.
   */
  SnsWebV2 = 'https://edith.xiaohongshu.com/api/sns/web/v2/',
  /**
   * The base URL for Rednote's IM API endpoints.
   */
  IM = 'https://edith.xiaohongshu.com/api/im/',
}

export { createRednoteHttpClient, RednoteAPIEndpoints };
