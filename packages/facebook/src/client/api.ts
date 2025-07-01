import { type OAuthSession } from '@social-sdk/auth/session';
import { PublicAPIClient } from '@social-sdk/client/api';
import { type HttpClient } from '@social-sdk/client/http';
import { createFacebookHttpClient } from './http.js';
import { type User } from '@/types/user.js';

export class FacebookPublicAPIClient extends PublicAPIClient<OAuthSession> {
  /**
   * The HTTP client for Facebook Graph API v23.0.
   */
  private v23: HttpClient;

  /**
   * Creates a new instance of the Facebook API client with authenticated HTTP client.
   *
   * @param session - The OAuth session used for authentication with Facebook Graph API
   */
  constructor(session: OAuthSession) {
    super(session);

    const http = createFacebookHttpClient(session);
    this.v23 = http.extend({ prefixUrl: 'https://graph.facebook.com/v23.0/' });
  }

  /**
   * Retrieves the authenticated user's profile information.
   *
   * @returns A promise that resolves to the user's profile information.
   */
  public async me(): Promise<User> {
    return await this.v23.get('me').json<User>();
  }
}
