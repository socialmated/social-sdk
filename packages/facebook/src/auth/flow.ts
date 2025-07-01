import { type AuthFlow } from '@social-sdk/auth/flow';
import { type PageCredential } from './credential.js';
import { type Page } from '@/types/page.js';

/**
 * Represents a flow for authenticating with Facebook's Page Credentials.
 *
 * This flow retrieves a list of Facebook Pages associated with the provided PageCredential.
 *
 * @example
 * ```typescript
 * const flow = new PageCredentialFlow(pageCredential);
 * const pages = await flow.authenticate();
 * console.log(pages);
 * ```
 */
export class PageCredentialFlow implements AuthFlow<PageCredential, Page[]> {
  /**
   * Creates a new instance of PageCredentialFlow.
   *
   * @param credential - Optional PageCredential to use for authentication.
   */
  constructor(private readonly credential?: PageCredential) {}

  /**
   * Authenticates using the provided PageCredential and retrieves the list of Facebook Pages.
   *
   * @param credential - Optional PageCredential to use for authentication. If not provided, uses the instance's credential.
   * @returns A Promise that resolves to an array of Page objects.
   * @throws Error if no credential is provided or if the request fails.
   */
  public async authenticate(credential?: PageCredential): Promise<Page[]> {
    const cred = credential ?? this.credential;
    if (!cred) {
      throw new Error('No credential provided for PageCredentialFlow');
    }

    const url = new URL(`https://graph.facebook.com/v23.0/${cred.userId}/accounts`);
    url.searchParams.set('access_token', cred.userAccessToken);

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch pages: ${res.statusText}`);
    }

    const data = (await res.json()) as Page[];

    return data;
  }
}
