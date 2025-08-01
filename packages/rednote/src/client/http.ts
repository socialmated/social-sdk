import { createHttpClient, type HttpClient } from '@social-sdk/client/http';
import { debug } from '@social-sdk/client/hooks';
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
function createRednoteHttpClient(session: RednoteCookieSession): HttpClient {
  const http = createHttpClient(session);
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

export { createRednoteHttpClient };
