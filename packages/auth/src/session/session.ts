import { type Promisable } from 'type-fest';

/**
 * Represents a session interface for managing session data, including retrieval,
 * refreshing, revocation, and expiration handling.
 */
export interface ReadonlySession {
  /**
   * Retrieves the value associated with the specified key from the session.
   *
   * @param key - The key whose value should be retrieved.
   * @returns A promise that resolves to the value as a string, or `null` if the key does not exist.
   */
  get: (key: string) => string | null;

  /**
   * Retrieves all key-value pairs stored in the session.
   *
   * @returns A promise that resolves to an object containing all session data.
   */
  getAll: () => Record<string, string>;

  /**
   * Refreshes the session, typically by updating access tokens or other session data.
   *
   * @param key - The key to refresh.
   *
   * @returns A promise that resolves to the refreshed value as a string.
   */
  refresh: (key?: string) => Promisable<string>;

  /**
   * Revokes the session, typically by invalidating access tokens or clearing session data.
   *
   * @returns A promise that resolves when the session is revoked.
   */
  revoke: () => Promisable<void>;

  /**
   * Get the remaining time in seconds until the session expires.
   *
   * @returns The remaining time in seconds until the session expires.
   */
  expiresIn: () => number;

  /**
   * Retrieves the scope of the session.
   *
   * @returns The scope as a string, or `undefined` if not found.
   */
  scope: () => string | undefined;

  /**
   * The issuer of the session, typically the base URL or domain.
   */
  issuer: URL | string;
}

export interface WritableSession extends ReadonlySession {
  /**
   * Sets a value in the session for the specified key.
   *
   * @param key - The key under which the value should be stored.
   * @param value - The value to store in the session.
   */
  set: (key: string, value: string) => void;

  /**
   * Clears the session data, effectively logging out the user or invalidating the session.
   */
  clear: () => void;
}
