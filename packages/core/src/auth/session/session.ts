/**
 * Represents a session interface for managing session data, including retrieval,
 * refreshing, revocation, and expiration handling.
 */
export interface Session {
  /**
   * Retrieves the value associated with the specified key from the session.
   *
   * @param key - The key whose value should be retrieved.
   * @returns A promise that resolves to the value as a string, or `undefined` if not found.
   */
  get: (key: string) => string | undefined;

  /**
   * Retrieves all key-value pairs stored in the session.
   *
   * @returns A promise that resolves to an object containing all session data.
   */
  getAll: () => Record<string, string>;

  /**
   * Refreshes the session, typically by updating access tokens or other session data.
   *
   * @param key - The key to refresh. If not provided, refreshes all keys.
   *
   * @returns A promise that resolves when the session is refreshed.
   */
  refresh: (key?: string) => Promise<void>;

  /**
   * Revokes the session, typically by invalidating access tokens or clearing session data.
   *
   * @param key - The key to revoke. If not provided, revokes all keys.
   *
   * @returns A promise that resolves when the session is revoked.
   */
  revoke: (key?: string) => Promise<void>;

  /**
   * Get the remaining time in seconds until the session expires.
   *
   * @param key - The key to check for expiration.
   * @returns The remaining time in seconds until the session expires.
   */
  expiresIn: (key?: string) => number;

  /**
   * Retrieves the scope associated with the specified key from the session.
   *
   * @param key - The key whose scope should be retrieved. If not provided, retrieves the default scope.
   * @returns The scope as a string, or `undefined` if not found.
   */
  scope: (key?: string) => string | undefined;

  /**
   * Clears the session data, effectively logging out the user or invalidating the session.
   */
  clear: () => void;

  /**
   * The issuer of the session, typically the base URL or domain.
   */
  issuer: URL | string;
}
