import { type ReadonlySession } from '@/session/index.js';

/**
 * Represents an authentication mechanism that validates credentials and returns a session.
 *
 * @typeParam TCred - The type of credential used for authentication.
 * @typeParam TSsn - The type of session returned upon successful authentication.
 */
export interface AuthFlow<TCred extends object, TSsn extends ReadonlySession> {
  authenticate: (credential: TCred) => Promise<TSsn>;
}

/**
 * Interface for controlling the display of a consent prompt.
 */
export interface ConsentPrompt {
  /**
   * Opens the consent prompt.
   *
   * @param timeout - Optional timeout in milliseconds for the open operation.
   * @returns A Promise that resolves when the prompt is opened.
   */
  open: (timeout?: number) => Promise<void>;

  /**
   * Closes the consent prompt.
   *
   * @returns A Promise that resolves when the prompt is closed.
   */
  close: () => Promise<void>;
}
