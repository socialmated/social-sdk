import { type Page } from 'playwright';
import { type WebLoginCredential } from '../credential/index.js';
import { CookieSession } from '../session/cookie.js';
import { type AuthFlow } from './flow.js';

/**
 * Abstract base class for implementing automated web-based authentication flows using web login credentials.
 *
 * This class defines the contract for automating login processes in web environments.
 * It provides a template method `authenticate` that orchestrates the authentication sequence: opening the page,
 * performing the login, extracting the session, and closing the page.
 *
 * @typeParam TCred - The type of credential used for authentication, extending `WebLoginCredential`.
 */
export abstract class AutomatedWebLoginFlow<TCred extends WebLoginCredential = WebLoginCredential>
  implements AuthFlow<TCred, CookieSession>
{
  constructor(protected page: Page) {}

  public abstract open(): Promise<Page>;

  public abstract login(credential: TCred): Promise<Page>;

  public abstract close(): Promise<void>;

  public async authenticate(credential: TCred): Promise<CookieSession> {
    await this.open();

    await this.login(credential);

    const session = CookieSession.fromPage(this.page);
    await this.close();

    return session;
  }
}
