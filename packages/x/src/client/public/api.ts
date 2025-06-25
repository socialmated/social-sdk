import { type OAuthSession } from '@social-sdk/auth/session';
import { PublicAPIClient } from '@social-sdk/client/api';
import { createHttpClient, type HttpClient } from '@social-sdk/client/http';

enum XAPIEndpoints {
  /**
   * The base URL for X's v1.1 API endpoints.
   */
  V11 = 'https://api.x.com/1.1/',
  /**
   * The base URL for X's v2 API endpoints.
   */
  V2 = 'https://api.x.com/2/',
}

export class XPublicAPIClient extends PublicAPIClient<OAuthSession> {
  /**
   * The HTTP client for the v1.1 API endpoint.
   */
  private v11: HttpClient;

  /**
   * The HTTP client for the v2 API endpoint.
   */
  private v2: HttpClient;

  /**
   * Creates an instance of the X Public API Client.
   *
   * @param session - An instance of `OAuthSession` used for managing OAuth authentication.
   */
  constructor(session: OAuthSession) {
    super(session);

    const http = createHttpClient(session);
    this.v11 = http.extend({ prefixUrl: XAPIEndpoints.V11 });
    this.v2 = http.extend({ prefixUrl: XAPIEndpoints.V2 });
  }

  public async userMe(): Promise<unknown> {
    return this.v2.get('users/me');
  }
}
