import { type Browser, type BrowserContext, type Page } from 'playwright';
import { AutomatedWebLoginFlow } from '@social-sdk/auth/flow';
import { type WebLoginCredential } from '@social-sdk/auth/credential';
import { XCookieSession } from './session.js';

/**
 * Provides an automated login flow for X (formerly Twitter)'s Onboarding and Confirmation (OCF)
 * authentication flow using Playwright.
 *
 * @remarks
 * - This class is designed for use in automated testing or scripting scenarios where programmatic login to X is required.
 * - It supports login via username, email, or phone, and handles additional verification steps as needed.
 * - If suspicious activity is detected, the flow will abort and throw an error.
 *
 * @example
 * ```typescript
 * const flow = await XAutomatedWebBasicFlow.create(browser);
 * await flow.open();
 * await flow.login({ username: 'user', password: 'pass' });
 * await flow.close();
 * ```
 *
 * @public
 */
export class XAutomatedWebLoginFlow extends AutomatedWebLoginFlow {
  /**
   * The entry point URL for the login page of X (formerly Twitter).
   */
  private static readonly LOGIN_PAGE_URL = 'https://x.com/i/flow/login';

  /**
   * The url of the home page of X (formerly Twitter).
   */
  private static readonly HOME_PAGE_URL = 'https://x.com/home';

  /**
   * Locator for the username input field on the authentication page.
   */
  private usernameInput = this.page.locator("input[autocomplete='username']");

  /**
   * Locator for the password input field on the authentication page.
   */
  private passwordInput = this.page.locator("input[autocomplete='current-password']");

  /**
   * Locator for the additional user ID input field on the authentication page.
   */
  private additionalUserIdInput = this.page.getByTestId('ocfEnterTextTextInput');

  /**
   * Locator for the acknowledge button on the authentication page.
   */
  private acknowledgeButton = this.page.getByTestId('OCF_CallToAction_Button');

  /**
   * Locator for the login button on the authentication page.
   */
  // private loginButton = this.page.getByTestId('LoginForm_Login_Button');

  /**
   * Creates a new instance of `XAutomatedWebBasicFlow` using a new page from the provided browser or browser context.
   *
   * @param browser - The Playwright `Browser` or `BrowserContext` to create a new page from.
   * @returns A promise that resolves to an instance of `XAutomatedWebBasicFlow` initialized with the new page.
   */
  public static async create(browser: Browser | BrowserContext): Promise<XAutomatedWebLoginFlow> {
    const page = await browser.newPage();
    return new XAutomatedWebLoginFlow(page);
  }

  /**
   * Authenticates a user to X (formerly Twitter) using the provided web login credentials.
   *
   * @param credential - The web login credentials used for authentication.
   * @returns A promise that resolves to an `XCookieSession` instance wrapping the authenticated session.
   * @throws An error if authentication fails.
   */
  public override async authenticate(credential: WebLoginCredential): Promise<XCookieSession> {
    const session = await super.authenticate(credential);
    return XCookieSession.wrap(session);
  }

  /**
   * Navigates the current page to the login entry point and returns the page instance.
   *
   * @returns A promise that resolves to the current page after navigation.
   */
  public async open(): Promise<Page> {
    await this.page.goto(XAutomatedWebLoginFlow.LOGIN_PAGE_URL);

    return this.page;
  }

  /**
   * Logs in to X (formerly Twitter) using the provided credentials.
   *
   * @param credential - The credentials to use for login, which can include username, email, or phone.
   * @returns A promise that resolves to the current page after successful login.
   * @throws If the login process encounters suspicious activity or if required fields are not filled.
   */
  public async login(credential: WebLoginCredential): Promise<Page> {
    await this.inputUserId(credential.username ?? credential.email ?? credential.phone);

    if (credential.username) {
      await Promise.race([this.inputPassword(credential.password), this.clickAcknowledgeButton()]);
    } else if (credential.email) {
      await Promise.race([
        this.inputPassword(credential.password),
        this.inputAdditionalUserId(credential.username ?? credential.phone).then(() =>
          this.inputPassword(credential.password),
        ),
        this.clickAcknowledgeButton(),
      ]);
    } else if (credential.phone) {
      await Promise.race([
        this.inputPassword(credential.password),
        this.inputAdditionalUserId(credential.username ?? credential.email).then(() =>
          this.inputPassword(credential.password),
        ),
        this.clickAcknowledgeButton(),
      ]);
    }

    await this.page.waitForURL(XAutomatedWebLoginFlow.HOME_PAGE_URL);

    return this.page;
  }

  /**
   * Closes the current page instance.
   *
   * @returns A promise that resolves when the page has been closed.
   */
  public async close(): Promise<void> {
    await this.page.close();
  }

  /**
   * Fills the password input field with the provided password and submits it by pressing 'Enter'.
   *
   * @param password - The password string to input into the password field.
   * @returns A promise that resolves when the password has been entered and submitted.
   */
  private async inputPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    // TODO: add options to use click()
    await this.passwordInput.press('Enter');
  }

  /**
   * Prompts the user to input an additional user ID for verification.
   *
   * If the `userId` parameter is not provided, an error is thrown to indicate that additional user verification is required.
   * Otherwise, fills the input field with the provided `userId` and submits it by pressing 'Enter'.
   *
   * @param userId - The additional user ID to be input for verification. If not provided, an error is thrown.
   * @returns A promise that resolves when the input has been filled and submitted.
   * @throws If `userId` is not provided.
   */
  private async inputAdditionalUserId(userId?: string): Promise<void> {
    if (!userId) throw new Error('Need additional user verification.');

    await this.additionalUserIdInput.fill(userId);
    // TODO: add options to use click()
    await this.additionalUserIdInput.press('Enter');
  }

  /**
   * Clicks the acknowledge button and immediately throws an error to abort the login process.
   *
   * This method is intended to be called when suspicious activity is detected during authentication.
   * After clicking the acknowledge button, it throws an error to prevent further login actions.
   *
   * @throws Always throws an error indicating suspicious activity was detected.
   */
  private async clickAcknowledgeButton(): Promise<void> {
    await this.acknowledgeButton.click();
    throw new Error('Suspicious activity detected. Aborting login.');
  }

  /**
   * Fills the username input field with the provided user ID and submits it.
   *
   * @param userId - The user identifier to input (username, email, or phone).
   *                 Throws an error if not provided.
   * @returns A promise that resolves when the input has been filled and submitted.
   * @throws If no userId is provided.
   */
  private async inputUserId(userId?: string): Promise<void> {
    if (!userId) throw new Error('No username, email, or phone provided.');

    await this.usernameInput.fill(userId);
    await this.usernameInput.press('Enter');
  }
}
