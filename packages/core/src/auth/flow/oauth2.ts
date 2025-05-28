import { type ChildProcess } from 'node:child_process';
import {
  type ServerMetadata,
  type ClientAuth,
  Configuration,
  type TokenEndpointResponse,
  type TokenEndpointResponseHelpers,
  randomPKCECodeVerifier,
  randomState,
  calculatePKCECodeChallenge,
  buildAuthorizationUrl,
  authorizationCodeGrant,
  clientCredentialsGrant,
} from 'openid-client';
import { type LiteralStringUnion } from 'type-fest/source/literal-union.js';
import open from 'open';
import { Hono } from 'hono';
import { type ServerType, serve } from '@hono/node-server';
import { OAuthSession } from '../session/oauth.js';
import { type OAuth2Credential } from '../credential/index.js';
import { type AuthFlow, type ConsentPromptOpener } from './flow.js';

/**
 * Options for configuring the OAuth 2.0 Authorization Code flow.
 *
 * @typeParam TScp - The type representing valid scope values.
 */
interface OAuth2AuthorizationCodeOptions<TScp> {
  /**
   * The list of scopes requested for the OAuth 2.0 flow.
   */
  scope: LiteralStringUnion<TScp>[];
}

/**
 * Implements the OAuth 2.0 Authorization Code Flow with PKCE (Proof Key for Code Exchange).
 *
 * This class handles the authorization code flow, including generating the code verifier,
 * building the authorization URL, handling the redirect, and exchanging the authorization code
 * for tokens. It is designed to work with OAuth 2.0 providers that support PKCE.
 *
 * @example
 * ```typescript
 * const flow = new OAuth2AuthorizationCodePKCEFlow(metadata, clientId, clientSecret);
 * const authUrl = await flow.initiate(['openid', 'profile']);
 * const redirectUrl = await flow.consent(authUrl);
 * const tokens = await flow.token(redirectUrl);
 * ```
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7636 | RFC 7636 - Proof Key for Code Exchange for OAuth 2.0}
 */
class OAuth2AuthorizationCodePKCEFlow<TScp> implements AuthFlow<OAuth2Credential, OAuthSession> {
  /**
   * The state parameter used to maintain state between the request and callback.
   */
  private state: string;
  /**
   * The code verifier used in the PKCE flow to verify the authorization code.
   */
  private codeVerifier: string;

  /**
   * Constructs an instance of the OAuth2 Authorization Code Flow with PKCE authenticator.
   *
   * @param metadata - The server metadata containing OAuth endpoints and configuration.
   * @param clientId - Optional client identifier for the OAuth application.
   * @param clientSecret - Optional client secret for the OAuth application.
   * @param clientAuth - Optional client authentication method for the OAuth flow.
   */
  constructor(
    private metadata: ServerMetadata,
    private clientId?: string,
    private clientSecret?: string,
    private clientAuth?: ClientAuth,
  ) {
    this.state = '';
    this.codeVerifier = '';
  }

  /**
   * Initiates the OAuth 2.0 authorization flow using PKCE (Proof Key for Code Exchange).
   *
   * This method generates a random code verifier and state, computes the PKCE code challenge,
   * and constructs the authorization URL with the specified scopes and redirect URI.
   *
   * @param scope - An array of scopes to request during authorization.
   * @param redirectUri - The URI to redirect to after authorization (defaults to 'http://localhost:3000/callback').
   * @returns A promise that resolves to the constructed authorization URL.
   * @throws Error if the client ID is not set.
   */
  public async initiate(
    scope: LiteralStringUnion<TScp>[],
    redirectUri: URL = new URL('http://localhost:3000/callback'),
  ): Promise<URL> {
    if (!this.clientId) {
      throw new Error('Client ID is required for authorization');
    }

    // Generate a random code verifier and state for the PKCE flow
    this.codeVerifier = randomPKCECodeVerifier();
    this.state = randomState();

    // Compute the PKCE code challenge from the code verifier
    const codeChallenge = await calculatePKCECodeChallenge(this.codeVerifier);

    // Create the authorization URL with the provided scopes and PKCE parameters
    const params = new URLSearchParams();
    params.set('response_type', 'code');
    params.set('redirect_uri', redirectUri.toString());
    params.set('scope', scope.join('+'));
    params.set('state', this.state);
    params.set('code_challenge', codeChallenge);
    params.set('code_challenge_method', 's256');

    // Build the full authorization URL using the configuration and parameters
    const config = new Configuration(this.metadata, this.clientId, this.clientSecret, this.clientAuth);
    return buildAuthorizationUrl(config, params);
  }

  /**
   * Initiates the OAuth consent flow by opening a local consent prompt.
   *
   * @param authorizationUrl - The URL to the OAuth authorization endpoint.
   * @param redirectUri - The URI to which the OAuth provider will redirect after consent. Defaults to 'http://localhost:3000/callback'.
   * @returns A promise that resolves to the redirect URL containing the authorization response.
   */
  public async consent(authorizationUrl: URL): Promise<URL> {
    const redirectUri = authorizationUrl.searchParams.get('redirect_uri');
    if (!redirectUri) {
      throw new Error('Redirect URI is required for consent');
    }

    return LocalConsentPromptOpener.consent(authorizationUrl, new URL(redirectUri));
  }

  /**
   * Authenticates using the provided OAuth credential and returns a new OAuth session.
   *
   * This method sets the client ID and client secret from the given credential,
   * initializes the configuration, performs authorization to obtain a grant,
   * exchanges the grant for tokens, and returns an authenticated session.
   *
   * @param credential - The OAuth credential containing client ID, client secret, and scope.
   * @returns A promise that resolves to an {@link OAuthSession} representing the authenticated session.
   * @throws If authorization or token exchange fails.
   */
  public async authenticate(
    credential: OAuth2Credential,
    options?: OAuth2AuthorizationCodeOptions<TScp>,
  ): Promise<OAuthSession> {
    this.clientId = credential.clientId;
    this.clientSecret = credential.clientSecret;

    const config = new Configuration(this.metadata, this.clientId, this.clientSecret, this.clientAuth);
    const grant = await this.authorize(options?.scope ?? []);
    const tokens = await this.token(grant);

    return new OAuthSession(config, tokens);
  }

  /**
   * Initiates the OAuth2 authorization flow by building the authorization URL,
   * prompting the user for consent, and returning the resulting grant URL.
   *
   * @param scope - An array of scopes to request during authorization.
   * @param redirectUri - The URI to redirect to after authorization. Defaults to 'http://localhost:3000/callback'.
   * @returns A promise that resolves to the grant URL after successful authorization.
   */
  public async authorize(
    scope: LiteralStringUnion<TScp>[],
    redirectUri = new URL('http://localhost:3000/callback'),
  ): Promise<URL> {
    // Build the full authorization URL using the configuration and parameters
    const authorizationUrl = await this.initiate(scope, redirectUri);
    const grant = await this.consent(authorizationUrl);

    return grant;
  }

  /**
   * Exchanges the authorization code for tokens using the PKCE flow.
   *
   * @param grant - The URL containing the authorization code and other parameters.
   * @param tokenEndpointParameters - Optional additional parameters to include in the token request.
   * @returns A promise that resolves to the token endpoint response, including access and refresh tokens.
   */
  public async token(
    grant: URL,
    tokenEndpointParameters?: URLSearchParams | Record<string, string>,
  ): Promise<TokenEndpointResponse & TokenEndpointResponseHelpers> {
    if (!this.clientId) {
      throw new Error('Client ID is required for token exchange');
    }

    // Exchange the authorization code for tokens using the PKCE flow and verify the state and code verifier.
    const config = new Configuration(this.metadata, this.clientId, this.clientSecret, this.clientAuth);
    return authorizationCodeGrant(
      config,
      grant,
      {
        expectedState: this.state,
        pkceCodeVerifier: this.codeVerifier,
      },
      tokenEndpointParameters,
    );
  }
}

/**
 * Implements the OAuth 2.0 Client Credentials Grant flow for authenticating clients with an authorization server.
 *
 * This class provides methods to exchange client credentials for access tokens and to authenticate using
 * the OAuth 2.0 client credentials grant type. It manages the configuration and credentials required for
 * the flow and returns an authenticated session upon successful authentication.
 *
 * @example
 * ```typescript
 * const flow = new OAuth2ClientCredentialFlow(metadata, clientId, clientSecret);
 * const tokens = await flow.token();
 * ```
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc6749#section-4.4 | OAuth 2.0 Client Credentials Grant}
 */
class OAuth2ClientCredentialFlow implements AuthFlow<OAuth2Credential, OAuthSession> {
  /**
   * Creates a new instance of the class with the specified OAuth2 configuration.
   *
   * @param metadata - The server metadata containing OAuth2 endpoints and related information.
   * @param clientId - (Optional) The client identifier issued to the client during the registration process.
   * @param clientSecret - (Optional) The client secret issued to the client during the registration process.
   * @param clientAuth - (Optional) The client authentication method to use when authenticating with the OAuth2 server.
   */
  constructor(
    private metadata: ServerMetadata,
    private clientId?: string,
    private clientSecret?: string,
    private clientAuth?: ClientAuth,
  ) {}

  /**
   * Exchanges client credentials for an OAuth2 access token using the client credentials grant flow.
   *
   * @returns A promise that resolves to an object containing the token endpoint response and helper methods.
   * @throws If the client ID is not provided.
   */
  public async token(): Promise<TokenEndpointResponse & TokenEndpointResponseHelpers> {
    if (!this.clientId) {
      throw new Error('Client ID is required for token exchange');
    }

    const config = new Configuration(this.metadata, this.clientId, this.clientSecret, this.clientAuth);
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
    });

    return clientCredentialsGrant(config, params);
  }

  /**
   * Authenticates using the provided OAuth2 client credentials and returns an OAuth session.
   *
   * @param credential - The OAuth2 client credentials used for authentication.
   * @returns A promise that resolves to an {@link OAuthSession} containing the authentication tokens.
   * @throws If authentication fails or token retrieval is unsuccessful.
   */
  public async authenticate(credential: OAuth2Credential): Promise<OAuthSession> {
    this.clientId = credential.clientId;
    this.clientSecret = credential.clientSecret;

    const config = new Configuration(this.metadata, this.clientId, this.clientSecret, this.clientAuth);
    const tokens = await this.token();

    return new OAuthSession(config, tokens);
  }
}

/**
 * Handles the OAuth2 consent flow by launching a local HTTP server to receive the authorization code
 * and opening the user's browser to the authorization URL.
 *
 * @remarks
 * This implementation is intended for local development or CLI tools where a browser can be launched
 * and a local HTTP server can be started to receive the OAuth2 redirect.
 *
 * @example
 * ```typescript
 * const redirectUrl = await LocalConsentPromptOpener.consent(authUrl, redirectUri);
 * // Extract authorization code from redirectUrl
 * ```
 */
class LocalConsentPromptOpener implements ConsentPromptOpener {
  /**
   * The Hono app instance used to handle incoming requests.
   */
  private app: Hono;
  /**
   * The server instance used to listen for incoming requests.
   */
  private server: ServerType;
  /**
   * The child process representing the browser instance.
   */
  private browser?: ChildProcess;
  /**
   * Indicates whether the authorization code has been received.
   */
  private received?: boolean;

  /**
   * Creates a new instance of the LocalConsentPromptOpener class.
   *
   * @param authorizationUrl - The URL to which the user should be directed to grant consent.
   * @param redirectUri - The URI to which the authorization server will redirect after consent.
   * @param onReceive - Callback function to handle the received authorization code.
   * @param onError - Callback function to handle errors during the authorization process.
   */
  private constructor(
    private authorizationUrl: URL,
    private redirectUri: URL,
    private onReceive: (callback: URL) => void,
    private onError: (err: Error) => void,
  ) {
    this.app = new Hono().get(
      this.redirectUri.pathname,
      async (_, next) => {
        await next();
        void this.close();
      },
      (c) => {
        this.onReceive(new URL(c.req.url));
        this.received = true;
        return c.text('Authorization code received. You can close this window.');
      },
    );
    this.server = serve({
      port: parseInt(this.redirectUri.port),
      fetch: this.app.fetch,
    });
  }

  /**
   * Initiates the OAuth consent flow by opening a local prompt for user authorization.
   *
   * @param authorizationUrl - The URL to which the user should be directed to grant consent.
   * @param redirectUri - The URI to which the authorization server will redirect after consent.
   * @returns A promise that resolves with the redirect URL containing the authorization response.
   */
  public static async consent(authorizationUrl: URL, redirectUri: URL): Promise<URL> {
    return new Promise((resolve, reject) => {
      const opener = new LocalConsentPromptOpener(authorizationUrl, redirectUri, resolve, reject);
      void opener.open();
    });
  }

  /**
   * Opens the authorization URL in the user's browser and waits for the authorization process to complete.
   * If the process does not complete within the specified timeout, an error is triggered.
   *
   * @param timeout - The maximum time to wait for authorization, in seconds. Defaults to 60 seconds.
   * @returns A promise that resolves when the authorization process is completed or rejects on error or timeout.
   */
  public async open(timeout = 60): Promise<void> {
    // Open the authorization URL in the user's browser
    try {
      this.browser = await open(this.authorizationUrl.toString(), { wait: false });
    } catch (e: unknown) {
      this.onError(e as Error);
    }

    setTimeout(() => {
      if (!this.received) {
        this.onError(new Error('Authorization timed out'));
        void this.close();
      }
    }, timeout * 1000);
  }

  /**
   * Closes the OAuth server and terminates the browser process if it exists.
   *
   * @returns A promise that resolves when the server is closed and the browser process is killed.
   */
  public close(): Promise<void> {
    this.server.close();
    this.browser?.kill();

    return Promise.resolve();
  }
}

export { OAuth2AuthorizationCodePKCEFlow, OAuth2ClientCredentialFlow };
export type { ServerMetadata, ClientAuth, OAuth2AuthorizationCodeOptions };
