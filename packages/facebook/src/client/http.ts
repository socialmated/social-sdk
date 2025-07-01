import { createHttpClient, got, type HttpClient } from '@social-sdk/client/http';
import { OAuthSession } from '@social-sdk/auth/session';
import { type ClientCredential } from '@/auth/credential.js';
import { type Page } from '@/types/page.js';

/**
 * Type guard to check if the provided object is an instance of OAuthSession.
 *
 * @param auth - The object to check.
 * @returns True if the object is an OAuthSession, false otherwise.
 */
const isOAuthSession = (auth: object): auth is OAuthSession => {
  return auth instanceof OAuthSession;
};

/**
 * Type guard to check if the provided object is an instance of ClientCredential.
 *
 * @param auth - The object to check.
 * @returns True if the object is a ClientCredential, false otherwise.
 */
const isClientCredential = (auth: object): auth is ClientCredential => {
  return 'appId' in auth && 'clientToken' in auth;
};

/**
 * Type guard to check if the provided object is an instance of Page.
 *
 * @param auth - The object to check.
 * @returns True if the object is a Page, false otherwise.
 */
const isPage = (auth: object): auth is Page => {
  return 'access_token' in auth && 'id' in auth && 'name' in auth && 'category' in auth;
};

/**
 * Creates an HTTP client instance configured for Facebook Graph API requests.
 *
 * @param sessionOrCredential - The OAuth session or credential used for authentication.
 * @returns An `HttpClient` instance pre-configured for Facebook Graph API requests.
 */
export const createFacebookHttpClient = (auth: OAuthSession | ClientCredential | Page): HttpClient => {
  if (isOAuthSession(auth)) {
    return createHttpClient(auth);
  }

  if (isClientCredential(auth)) {
    return got.extend({
      headers: {
        'user-agent': 'social-sdk/0.1.0',
        accept: 'application/json',
      },
      searchParams: {
        access_token: `${auth.appId}|${auth.clientToken}`,
      },
    });
  }

  if (isPage(auth)) {
    if (!auth.access_token) {
      throw new Error('Page access token is required for Facebook HTTP client');
    }

    return got.extend({
      headers: {
        'user-agent': 'social-sdk/0.1.0',
        accept: 'application/json',
      },
      searchParams: {
        access_token: auth.access_token,
      },
    });
  }

  throw new Error('Unsupported authentication type for Facebook HTTP client');
};
