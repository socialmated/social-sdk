/**
 * Credential for accessing Facebook Pages
 * @see {@link https://developers.facebook.com/docs/facebook-login/access-tokens#pagetokens | Facebook Login - Page Access Tokens}
 */
interface PageCredential {
  /**
   * The User ID of the Facebook user who has granted access to the Page.
   */
  userId: string;
  /**
   * The Access Token of the user who has granted access to the Page.
   */
  userAccessToken: string;
}

/**
 * Credential for accessing on behalf of a Facebook App
 * @see {@link https://developers.facebook.com/docs/facebook-login/access-tokens#clienttokens | Facebook Login - Client Token}
 */
interface ClientCredential {
  /**
   * The App ID of the Facebook App.
   */
  appId: string;
  /**
   * The Client Access Token for the Facebook App.
   */
  clientToken: string;
}

export type { PageCredential, ClientCredential };
