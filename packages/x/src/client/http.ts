import { type CancelableRequest, type Response } from 'got';
import { debug } from '@social-sdk/core/hooks';
import { createCookieHttpClient, type HttpClient } from '@social-sdk/core/client';
import { TransactionIdSigner } from '@/security/sign/signer.js';
import { type XCookieSession } from '@/auth/session.js';
import { setupSession, signTransactionId } from '@/hooks/request.js';
import { retryOnUnauthorized } from '@/hooks/response.js';

/**
 * Represents a function that performs a GraphQL request, either a query or mutation.
 */
type GraphQLRequestFunction = (
  id: string,
  name: string,
  variables?: Record<string, unknown>,
  features?: Record<string, boolean>,
  fieldToggles?: Record<string, boolean>,
) => CancelableRequest<Response<string>>;

/**
 * Represents a GraphQL HTTP client that extends the base `HttpClient` with GraphQL-specific methods.
 */
type GraphQLHttpClient = HttpClient & {
  /**
   * Represents a function that performs a GraphQL query operation.
   *
   * @param id - The ID of the operation.
   * @param name - The name of the operation.
   * @param variables - Optional. A record of variables to be passed to the GraphQL operation.
   * @param features - Optional. A record of feature flags to enable or disable specific features for the request.
   * @param fieldToggles - Optional. A record of field toggles to include or exclude specific fields in the request.
   * @returns A `CancelableRequest` that resolves to a `Response` containing a string result.
   */
  query: GraphQLRequestFunction;
  /**
   * Represents a function that performs a GraphQL mutation operation.
   *
   * @param id - The ID of the operation.
   * @param name - The name of the operation.
   * @param variables - Optional. A record of variables to be passed to the GraphQL operation.
   * @param features - Optional. A record of feature flags to enable or disable specific features for the request.
   * @param fieldToggles - Optional. A record of field toggles to include or exclude specific fields in the request.
   * @returns A `CancelableRequest` that resolves to a `Response` containing a string result.
   */
  mutation: GraphQLRequestFunction;
};

/**
 * Enhances a given `HttpClient` instance with GraphQL-specific `query` and `mutation` methods.
 *
 * @param base - The base `HttpClient` instance to enhance.
 * @returns A `GraphQLHttpClient` with `query` and `mutation` methods in addition to the base client's methods.
 */
function useGraphQLHttpClient(base: HttpClient): GraphQLHttpClient {
  const query = (
    id: string,
    name: string,
    variables?: Record<string, unknown>,
    features?: Record<string, boolean>,
    fieldToggles?: Record<string, boolean>,
  ): CancelableRequest<Response<string>> => {
    const searchParams: Record<string, string> = {};
    if (variables) {
      searchParams['variables'] = JSON.stringify(variables);
    }
    if (features) {
      searchParams['features'] = JSON.stringify(features);
    }
    if (fieldToggles) {
      searchParams['fieldToggles'] = JSON.stringify(fieldToggles);
    }

    return base.get(`${id}/${name}`, {
      searchParams,
    });
  };

  const mutation = (
    id: string,
    name: string,
    variables?: Record<string, unknown>,
    features?: Record<string, boolean>,
    fieldToggles?: Record<string, boolean>,
  ): CancelableRequest<Response<string>> => {
    const searchParams: Record<string, string> = {};
    if (variables) {
      searchParams['variables'] = JSON.stringify(variables);
    }
    if (features) {
      searchParams['features'] = JSON.stringify(features);
    }
    if (fieldToggles) {
      searchParams['fieldToggles'] = JSON.stringify(fieldToggles);
    }

    return base.post(`${id}/${name}`, {
      searchParams,
    });
  };

  return Object.assign(base, {
    query,
    mutation,
  });
}

/**
 * Creates an HTTP client instance configured for X (Twitter) API requests with necessary headers and authentication.
 *
 * @param session - An instance of `XCookieSession` used for managing authentication cookies and tokens.
 * @returns An `HttpClient` instance pre-configured with required headers, authentication, and request/response hooks.
 */
const createXHttpClient = (session: XCookieSession): HttpClient => {
  const http = createCookieHttpClient(session);
  const signer = new TransactionIdSigner();

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
      beforeRequest: [setupSession(session), signTransactionId(signer), debug],
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

export { useGraphQLHttpClient, createXHttpClient, XAPIEndpoints };
export type { GraphQLHttpClient, GraphQLRequestFunction };
