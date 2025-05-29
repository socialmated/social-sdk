import { createCookieHttpClient, type HttpClient } from '@social-sdk/core/client';
import { debug } from '@social-sdk/core/hooks';
import { type RednoteCookieSession } from '@/auth/session.js';
import { XSCommonGenerator } from '@/security/fingerprint/generator.js';
import { XhsSigner } from '@/security/sign/signer.js';
import { addFingerprint, setupTracing, signRequest } from '@/hooks/request.js';

/**
 * Creates an HTTP client configured for making requests to Rednote (Xiaohongshu) API endpoints.
 *
 * @param url - The base URL for the Rednote API endpoints
 * @param session - The authenticated cookie session containing user credentials and tokens
 * @returns A configured HttpClient instance ready for making authenticated requests to Rednote API
 */
function createRednoteHttpClient(url: string | URL, session: RednoteCookieSession): HttpClient {
  const http = createCookieHttpClient(url, session);
  const signer = XhsSigner.fromSession(session);
  const generator = new XSCommonGenerator(session);

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
      afterResponse: [debug],
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
  AS = 'https://as.xiaohongshu.com/api',
  /**
   * The base URL for Rednote's main API endpoints.
   */
  EDITH = 'https://edith.xiaohongshu.com/api',
}

export { createRednoteHttpClient, RednoteAPIEndpoints };
