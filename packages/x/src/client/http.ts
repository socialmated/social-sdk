import { type PaginateData, type PaginationOptions, type CancelableRequest, type Response } from 'got';
import { debug } from '@social-sdk/core/hooks';
import { createCookieHttpClient, type PrivateHttpClient } from '@social-sdk/core/client';
import { ExtendedPaginationOptions, type OptionsInit } from 'got-scraping';
import { type Merge } from 'type-fest';
import { TransactionIdSigner } from '@/security/sign/signer.js';
import { type XCookieSession } from '@/auth/session.js';
import { addForwardedFor, setupSession, signTransactionId } from '@/hooks/request.js';
import { retryOnUnauthorized } from '@/hooks/response.js';
import { XPFwdForGenerator } from '@/security/fingerprint/generator.js';

/**
 * Represents a function that performs a GraphQL request, either a query or mutation.
 */
type GraphQLRequestFunction = (
  id: string,
  name: string,
  options?: GraphQLOptionsInit,
) => CancelableRequest<Response<string>>;

type GraphQLPaginationFunction = <T, R>(
  id: string,
  name: string,
  options?: GraphQLOptionsWithPagination<T, R>,
) => AsyncIterableIterator<T>;

/**
 * Represents a GraphQL HTTP client that extends the base `HttpClient` with GraphQL-specific methods.
 */
type GraphQLHttpClient = Merge<
  Omit<PrivateHttpClient, 'put' | 'post' | 'get' | 'delete' | 'head' | 'patch'>,
  {
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

    /**
     * Represents a function that performs a paginated GraphQL request.
     *
     * @param id - The ID of the operation.
     * @param name - The name of the operation.
     * @param options - Optional. An object containing pagination options and other configurations.
     * @returns An `AsyncIterableIterator` that yields elements of type `T`.
     */
    paginate: GraphQLPaginationFunction;
  }
>;

type GraphQLOptionsInit = Omit<OptionsInit, 'searchParams' | 'url'> & {
  variables?: Record<string, unknown>;
  features?: Record<string, boolean>;
  fieldToggles?: Record<string, boolean>;
};

type GraphQLPaginationOptions<ElementType, BodyType> = Merge<
  PaginationOptions<ElementType, BodyType>,
  {
    paginate?: (data: PaginateData<BodyType, ElementType>) => GraphQLOptionsInit | false;
  }
>;

type GraphQLOptionsWithPagination<T, R> = Merge<
  GraphQLOptionsInit,
  {
    pagination?: GraphQLPaginationOptions<T, R>;
  }
>;

/**
 * Enhances a given `HttpClient` instance with GraphQL-specific `query` and `mutation` methods.
 *
 * @param base - The base `HttpClient` instance to enhance.
 * @returns A `GraphQLHttpClient` with `query` and `mutation` methods in addition to the base client's methods.
 */
function useGraphQLHttpClient(base: PrivateHttpClient): GraphQLHttpClient {
  const query = (id: string, name: string, options?: GraphQLOptionsInit): CancelableRequest<Response<string>> => {
    const searchParams = new URLSearchParams();
    if (options?.variables) {
      searchParams.set('variables', JSON.stringify(options.variables));
    }
    if (options?.features) {
      searchParams.set('features', JSON.stringify(options.features));
    }
    if (options?.fieldToggles) {
      searchParams.set('fieldToggles', JSON.stringify(options.fieldToggles));
    }

    return base.get(`${id}/${name}`, {
      searchParams,
    });
  };

  const mutation = (id: string, name: string, options?: GraphQLOptionsInit): CancelableRequest<Response<string>> => {
    const searchParams = new URLSearchParams();
    if (options?.variables) {
      searchParams.set('variables', JSON.stringify(options.variables));
    }
    if (options?.features) {
      searchParams.set('features', JSON.stringify(options.features));
    }
    if (options?.fieldToggles) {
      searchParams.set('fieldToggles', JSON.stringify(options.fieldToggles));
    }

    return base.post(`${id}/${name}`, {
      searchParams,
    });
  };

  const paginate = <T, R>(id: string, name: string, options?: GraphQLOptionsWithPagination<T, R>) => {
    const searchParams = new URLSearchParams();
    if (options?.variables) {
      searchParams.set('variables', JSON.stringify(options.variables));
    }
    if (options?.features) {
      searchParams.set('features', JSON.stringify(options.features));
    }
    if (options?.fieldToggles) {
      searchParams.set('fieldToggles', JSON.stringify(options.fieldToggles));
    }

    return base.paginate<T, R>(`${id}/${name}`, {
      searchParams,
      pagination: {
        ...options?.pagination,
        paginate: (data: PaginateData<R, T>) => {
          if (options?.pagination?.paginate) {
            const paginationOptions = options.pagination.paginate(data);
            if (paginationOptions === false) return false;

            const newSearchParams = new URLSearchParams();
            if (options.variables || paginationOptions.variables) {
              newSearchParams.set(
                'variables',
                JSON.stringify({
                  ...options.variables,
                  ...paginationOptions.variables,
                }),
              );
            }
            if (options.features || paginationOptions.features) {
              newSearchParams.set(
                'features',
                JSON.stringify({
                  ...options.features,
                  ...paginationOptions.features,
                }),
              );
            }
            if (options.fieldToggles || paginationOptions.fieldToggles) {
              newSearchParams.set(
                'fieldToggles',
                JSON.stringify({
                  ...options.fieldToggles,
                  ...paginationOptions.fieldToggles,
                }),
              );
            }

            return {
              ...paginationOptions,
              searchParams: newSearchParams,
            };
          }
          return false;
        },
      },
    });
  };

  return Object.assign(base, {
    query,
    mutation,
    paginate,
  });
}

/**
 * Creates an HTTP client instance configured for X (Twitter) API requests with necessary headers and authentication.
 *
 * @param session - An instance of `XCookieSession` used for managing authentication cookies and tokens.
 * @returns An `HttpClient` instance pre-configured with required headers, authentication, and request/response hooks.
 */
const createXHttpClient = (session: XCookieSession): PrivateHttpClient => {
  const http = createCookieHttpClient(session);
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

export { useGraphQLHttpClient, createXHttpClient, XAPIEndpoints };
export type {
  GraphQLHttpClient,
  GraphQLRequestFunction,
  GraphQLOptionsInit,
  GraphQLPaginationOptions,
  GraphQLOptionsWithPagination,
  GraphQLPaginationFunction,
};
