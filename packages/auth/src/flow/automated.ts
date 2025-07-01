import { type Page } from 'playwright';
import { type AuthFlow } from './flow.js';
import { type WebLoginCredential } from '@/credential/index.js';
import { CookieSession } from '@/session/cookie.js';

/**
 * Abstract base class for implementing automated web-based authentication flows using web login credentials.
 *
 * @typeParam TCred - The type of credential used for authentication, extending `WebLoginCredential`.
 */
export abstract class AutomatedWebLoginFlow<TCred extends WebLoginCredential = WebLoginCredential>
  implements AuthFlow<TCred, CookieSession>
{
  /**
   * Creates an instance of the automated web login flow.
   */
  constructor(protected page: Page) {}

  /**
   * Opens the web page for the authentication flow.
   *
   * @returns A Promise that resolves to the `Page` instance used for the authentication flow.
   */
  public abstract open(): Promise<Page>;

  /**
   * Logs in using the provided credentials.
   *
   * @param credential - The credentials used for logging in.
   * @returns A Promise that resolves to the `Page` instance after login.
   */
  public abstract login(credential: TCred): Promise<Page>;

  /**
   * Closes the authentication flow, cleaning up any resources used.
   *
   * @returns A Promise that resolves when the flow is closed.
   */
  public abstract close(): Promise<void>;

  /**
   * Authenticates the user using the provided credentials and returns a `CookieSession`.
   *
   * @param credential - The credentials used for authentication.
   * @returns A Promise that resolves to a `CookieSession` containing the authenticated session.
   */
  public async authenticate(credential: TCred): Promise<CookieSession> {
    await this.open();

    await this.login(credential);

    const session = CookieSession.fromPage(this.page);
    await this.close();

    return session;
  }
}
