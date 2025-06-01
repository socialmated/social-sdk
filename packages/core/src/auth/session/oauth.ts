import {
  refreshTokenGrant,
  type Configuration,
  type TokenEndpointResponse,
  type TokenEndpointResponseHelpers,
  tokenRevocation,
} from 'openid-client';
import { type ReadonlySession } from './session.js';

/**
 * Defines the type of metadata in an OAuth session.
 */
type MetadataType = 'server' | 'client' | 'tokens';

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
class OAuthSession implements ReadonlySession {
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
  public get(key: string, from?: MetadataType): string | null {
    if ((!from || from === 'tokens') && this.tokens[key]) {
      return JSON.stringify(this.tokens[key]);
    }
    if ((!from || from === 'server') && this.config.serverMetadata()[key]) {
      return JSON.stringify(this.config.serverMetadata()[key]);
    }
    if ((!from || from === 'client') && this.config.clientMetadata()[key]) {
      return JSON.stringify(this.config.clientMetadata()[key]);
    }

    return null;
  }

  /**
   * Retrieves all metadata and tokens as a single object with string values.
   *
   * @returns An object containing all metadata and tokens, where each value is a JSON string.
   */
  public getAll(from?: MetadataType): Record<string, string> {
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

    const tokens = !from || from === 'tokens' ? expand(this.tokens) : {};
    const serverMetadata = !from || from === 'server' ? expand(this.config.serverMetadata()) : {};
    const clientMetadata = !from || from === 'server' ? expand(this.config.clientMetadata()) : {};

    return {
      ...serverMetadata,
      ...clientMetadata,
      ...tokens,
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
  public async refresh(parameters?: URLSearchParams | Record<string, string>): Promise<string> {
    // Check if the refresh token is available
    if (!this.tokens.refresh_token) {
      throw new Error('No refresh token available');
    }

    // Update the tokens using the refresh token grant
    this.tokens = await refreshTokenGrant(this.config, this.tokens.refresh_token, parameters);
    // Return the new access token
    return this.tokens.access_token;
  }

  /**
   * Revokes either the access token or the refresh token associated with the current session.
   *
   * @param key - Specifies which token to revoke: either `'access_token'` or `'refresh_token'`,
   *              or `undefined` to revoke both.
   * @param params - Optional additional parameters to include in the revocation request.
   * @returns A promise that resolves when the revocation process is complete.
   */
  public async revoke(
    key?: 'access_token' | 'refresh_token',
    params?: URLSearchParams | Record<string, string>,
  ): Promise<void> {
    // Revoke the access token
    if (!key || key === 'access_token') {
      await tokenRevocation(this.config, this.tokens.access_token, params);
    }
    // Optionally revoke the refresh token if available
    if ((!key || key === 'refresh_token') && this.tokens.refresh_token) {
      await tokenRevocation(this.config, this.tokens.refresh_token, params);
    }
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

export { OAuthSession };
export type { MetadataType };
