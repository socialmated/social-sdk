import {
  refreshTokenGrant,
  type Configuration,
  type TokenEndpointResponse,
  type TokenEndpointResponseHelpers,
  tokenRevocation,
  customFetch,
} from 'openid-client';
import { type Session } from './session.js';

/**
 * Represents an OAuth session, encapsulating token management and session metadata.
 *
 * The `OAuthSession` class provides methods for storing, retrieving, and managing OAuth tokens
 * and associated session metadata. It supports refreshing and revoking tokens, as well as
 * accessing claims and token details such as expiration, scope, and authorization details.
 *
 * @remarks
 * This class is designed to be used as part of an OAuth authentication flow, handling
 * the lifecycle of access, refresh, and ID tokens, and providing utility methods for
 * interacting with token endpoint responses.
 *
 * @example
 * ```typescript
 * const session = new OAuthSession(config, tokens);
 * const accessToken = session.get('access_token');
 * await session.refresh();
 * ```
 *
 * @public
 */
export class OAuthSession implements Session {
  /**
   * Creates an instance of `OAuthSession`.
   *
   * @param config - The OAuth configuration object.
   * @param tokens - The OAuth tokens.
   */
  constructor(
    private config: Configuration,
    private tokens: TokenEndpointResponse & TokenEndpointResponseHelpers,
  ) {}

  /**
   * Retrieves the value associated with the specified key from the session.
   *
   * @param key - The key whose value should be retrieved.
   * @returns The value as a string, or `undefined` if not found.
   */
  public get(key: string): string | undefined {
    if (this.tokens[key]) {
      return JSON.stringify(this.tokens[key]);
    }
    if (this.config.serverMetadata()[key]) {
      return JSON.stringify(this.config.serverMetadata()[key]);
    }
    if (this.config.clientMetadata()[key]) {
      return JSON.stringify(this.config.clientMetadata()[key]);
    }

    return undefined;
  }

  /**
   * Retrieves all metadata and tokens as a single object with string values.
   *
   * @returns An object containing all metadata and tokens, where each value is a JSON string.
   */
  public getAll(): Record<string, string> {
    const expand = (obj: Record<string, unknown>): Record<string, string> => {
      return Object.entries(obj).reduce<Record<string, string>>((acc, [key, value]) => {
        if (typeof value === 'object' && value !== null) {
          acc[key] = JSON.stringify(value);
        } else {
          acc[key] = String(value);
        }
        return acc;
      }, {});
    };

    const tokens = expand(this.tokens);
    const serverMetadata = expand(this.config.serverMetadata());
    const clientMetadata = expand(this.config.clientMetadata());

    return {
      ...serverMetadata,
      ...clientMetadata,
      ...tokens,
    };
  }

  /**
   * Clears the session data, effectively logging out the user or invalidating the session.
   */
  public clear(): void {
    this.tokens = {
      access_token: '',
      refresh_token: undefined,
      id_token: undefined,
      scope: undefined,
      token_type: '',
      claims: () => undefined,
      expiresIn: () => undefined,
    } as TokenEndpointResponse & TokenEndpointResponseHelpers;
    this.config = {
      serverMetadata: () => this.config.serverMetadata(),
      clientMetadata: () => ({
        client_id: '',
      }),
      timeout: undefined,
      [customFetch]: undefined,
    };
  }

  /**
   * Refreshes the current session's tokens using the OAuth refresh token grant.
   *
   * @param key - The key to refresh. Only `'access_token'` is supported.
   * @param parameters - Optional additional parameters to include in the refresh request.
   *                     Can be a URLSearchParams object or a plain record of key-value pairs.
   * @throws If no refresh token is available in the current session.
   * @returns A promise that resolves to the new access token as a string.
   */
  public async refresh(key = 'access_token', parameters?: URLSearchParams | Record<string, string>): Promise<string> {
    // Check if the refresh token is available
    if (!this.tokens.refresh_token) {
      throw new Error('No refresh token available');
    }
    if (key !== 'access_token') {
      throw new Error('Invalid key. Only "access_token" is supported for refresh.');
    }

    // Update the tokens using the refresh token grant
    this.tokens = await refreshTokenGrant(this.config, this.tokens.refresh_token, parameters);
    // Return the new access token
    return this.tokens.access_token;
  }

  /**
   * Revokes either the access token or the refresh token associated with the current session.
   *
   * @param key - Specifies which token to revoke: either `'access_token'` or `'refresh_token'`.
   * @param params - Optional additional parameters to include in the revocation request.
   * @returns A promise that resolves when the revocation process is complete.
   */
  public async revoke(key?: string, params?: URLSearchParams | Record<string, string>): Promise<void> {
    // Revoke the access token
    if (key === 'access_token') {
      return tokenRevocation(this.config, this.tokens.access_token, params);
    }
    // Optionally revoke the refresh token if available
    if (key === 'refresh_token' && this.tokens.refresh_token) {
      return tokenRevocation(this.config, this.tokens.refresh_token, params);
    }

    // If no key is provided, revoke both tokens
    await Promise.all([this.revoke('access_token', params), this.revoke('refresh_token', params)]);
  }

  /**
   * Retrieves the expiration time of the current OAuth session's tokens.
   *
   * @returns The expiration time in seconds since the epoch, or `NaN` if not available.
   */
  public expiresIn(): number {
    return this.tokens.expiresIn() ?? NaN;
  }

  /**
   * Gets the OAuth scope associated with the current session tokens.
   *
   * @returns The scope as a space-delimited string, or `undefined` if no scope is set.
   */
  public scope(): string | undefined {
    return this.tokens.scope;
  }

  /**
   * The issuer of the session, typically the base URL or domain.
   */
  public get issuer(): URL {
    return new URL(this.config.serverMetadata().issuer);
  }

  /**
   * The response of the token endpoint.
   */
  public get tokenResponse(): TokenEndpointResponse & TokenEndpointResponseHelpers {
    return this.tokens;
  }
}
