import { type RequireAtLeastOne } from 'type-fest';

/**
 * Represents credentials for basic user authentication.
 */
export type WebLoginCredential = RequireAtLeastOne<
  {
    /**
     * The authentication method used.
     */
    method: 'basic';

    /**
     * The username for authentication.
     */
    username?: string;

    /**
     * The email address associated with the account, if applicable.
     */
    email?: string;

    /**
     * The phone number associated with the account, if applicable.
     */
    phone?: string;

    /**
     * The password for authentication.
     */
    password: string;
  },
  'username' | 'email' | 'phone'
>;

/**
 * Represents OAuth 2.0 credentials.
 */
export interface OAuth2Credential {
  /**
   * The OAuth 2.0 client identifier.
   */
  clientId: string;
  /**
   * The optional OAuth 2.0 client secret.
   */
  clientSecret?: string;
}

/**
 * Represents HTTP Basic authentication credentials.
 */
export interface HttpBasicCredential {
  /**
   * The username for HTTP Basic authentication.
   */
  username: string;

  /**
   * The password for HTTP Basic authentication.
   */
  password: string;
}
