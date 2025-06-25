import { debug } from '@social-sdk/client/hooks';
import { createHttpClient, type HttpClient } from '@social-sdk/client/http';
import { TransactionIdSigner } from '@/security/sign/signer.js';
import { type XCookieSession } from '@/auth/session.js';
import { addForwardedFor, setupSession, signTransactionId } from '@/hooks/request.js';
import { retryOnUnauthorized } from '@/hooks/response.js';
import { XPFwdForGenerator } from '@/security/fingerprint/generator.js';

/**
 * Creates an HTTP client instance configured for X (Twitter) API requests with necessary headers and authentication.
 *
 * @param session - An instance of `XCookieSession` used for managing authentication cookies and tokens.
 * @returns An `HttpClient` instance pre-configured with required headers, authentication, and request/response hooks.
 */
const createXHttpClient = (session: XCookieSession): HttpClient => {
  const http = createHttpClient(session);
  const signer = new TransactionIdSigner();
  const generator = new XPFwdForGenerator(session);

  return http.extend({
    headers: {
      origin: 'https://x.com',
      referer: 'https://x.com/home',
      accept: '*/*',
      'content-type': 'application/json',
      'x-twitter-client-language': 'en',
      'x-twitter-active-user': 'yes',
      'x-twitter-auth-type': 'OAuth2Session',
    },
    sessionToken: {
      gt: session.get('gt'),
      auth_token: session.get('auth_token'),
    },
    hooks: {
      beforeRequest: [setupSession(session), signTransactionId(signer), addForwardedFor(generator), debug],
      afterResponse: [retryOnUnauthorized(session), debug],
    },
  });
};

/**
 * The API endpoints of X.
 */
enum XAPIEndpoints {
  /**
   * The base URL for X's v1.1 API endpoints.
   */
  V11 = 'https://x.com/i/api/1.1/',
  /**
   * The base URL for X's v2 API endpoints.
   */
  V2 = 'https://api.x.com/2/',
  /**
   * The base URL for X's GraphQL API endpoints.
   */
  GraphQL = 'https://x.com/i/api/graphql/',
}

export { createXHttpClient, XAPIEndpoints };
