import {
  type CancelableRequest,
  type OptionsInit,
  type PaginateData,
  type PaginationOptions,
  type Response,
} from 'got';
import { type Merge } from 'type-fest';
import { type HttpClient } from '@/http/index.js';

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
type GraphQLHttpClient<T extends HttpClient> = Merge<
  Omit<T, 'put' | 'post' | 'get' | 'delete' | 'head' | 'patch'>,
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

/**
 * Enhances a given `HttpClient` instance with GraphQL-specific `query` and `mutation` methods.
 *
 * @param base - The base `HttpClient` instance to enhance.
 * @returns A `GraphQLHttpClient` with `query` and `mutation` methods in addition to the base client's methods.
 */
function useGraphQLHttpClient<T extends HttpClient>(base: T): GraphQLHttpClient<T> {
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

  const paginate = <S, R>(
    id: string,
    name: string,
    options?: GraphQLOptionsWithPagination<S, R>,
  ): AsyncIterableIterator<S> => {
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

    return base.paginate<S, R>(`${id}/${name}`, {
      searchParams,
      pagination: {
        ...options?.pagination,
        // eslint-disable-next-line sonarjs/function-return-type -- expected
        paginate: (data: PaginateData<R, S>) => {
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

export { useGraphQLHttpClient };
export type {
  GraphQLHttpClient,
  GraphQLRequestFunction,
  GraphQLOptionsInit,
  GraphQLPaginationFunction,
  GraphQLPaginationOptions,
  GraphQLOptionsWithPagination,
};
