import {
  type ClientAuth,
  type ServerMetadata,
  OAuth2AuthorizationCodePKCEFlow,
  OAuth2ClientCredentialFlow,
} from '@social-sdk/core/auth/flow';

/**
 * OAuth 2.0 server metadata configuration for X (formerly Twitter) API.
 *
 * Contains the necessary endpoints and issuer information required for
 * OAuth 2.0 authentication flows with the X platform.
 *
 * @see {@link https://developer.x.com/en/docs/authentication/oauth-2-0 | X OAuth 2.0 Documentation}
 */
const oauth2Server: ServerMetadata = {
  issuer: 'https://x.com',
  authorization_endpoint: 'https://x.com/i/oauth2/authorize',
  token_endpoint: 'https://api.x.com/2/oauth2/token',
};

/**
 * Client authentication function that implements HTTP Basic Authentication for OAuth clients.
 *
 * @param _as - Authorization server configuration (unused).
 * @param client - OAuth client configuration containing client credentials.
 * @param _body - Request body (unused).
 * @param headers - HTTP headers object to modify with authentication information.
 */
const clientAuth: ClientAuth = (_as, client, _body, headers) => {
  if (client.client_secret) {
    const encoded = Buffer.from(`${client.client_id}:${client.client_secret}`).toString('base64');
    headers.set('Authorization', `Basic ${encoded}`);
  }
};

/**
 * OAuth 2.0 scopes available for Twitter API authentication.
 *
 * These scopes define the permissions that can be requested when authenticating
 * with the Twitter API using OAuth 2.0. Each scope grants access to specific
 * API endpoints and operations.
 */
type OAuth2Scopes =
  | 'tweet.read'
  | 'tweet.write'
  | 'tweet.moderate.write'
  | 'users.read'
  | 'follows.read'
  | 'follows.write'
  | 'offline.access'
  | 'space.read'
  | 'mute.read'
  | 'mute.write'
  | 'like.read'
  | 'like.write'
  | 'list.read'
  | 'list.write'
  | 'block.read'
  | 'block.write'
  | 'bookmark.read'
  | 'bookmark.write'
  | 'dm.read'
  | 'dm.write';

/**
 * Configuration arguments for creating an OAuth 2.0 PKCE (Proof Key for Code Exchange) authentication flow.
 */
interface CreateOAuth2PKCEFlowArgs {
  /**
   * The type of authentication flow to create.
   */
  type: 'oauth2:pkce';
  /**
   * The client ID for the OAuth 2.0 application.
   */
  clientId: string;
  /**
   * The client secret for the OAuth 2.0 application, if applicable.
   */
  clientSecret?: string;
}

/**
 * Configuration arguments for creating an OAuth 2.0 Client Credentials authentication flow.
 */
interface CreateOAuth2ClientCredentialsFlowArgs {
  /**
   * The type of authentication flow to create.
   */
  type: 'oauth2:client_credentials';
  /**
   * The consumer key (client ID) for the OAuth 2.0 application.
   */
  consumerKey: string;
  /**
   * The consumer secret (client secret) for the OAuth 2.0 application, if applicable.
   */
  consumerSecret?: string;
}

/**
 * Configuration arguments for creating an OAuth 1a authentication flow.
 */
interface CreateOAuth1aFlowArgs {
  /**
   * The type of authentication flow to create.
   */
  type: 'oauth1a';
  /**
   * The consumer key (client ID) for the OAuth 1a application.
   */
  consumerKey?: string;
  /**
   * The consumer secret (client secret) for the OAuth 1a application, if applicable.
   */
  consumerSecret?: string;
}

/**
 * Configuration arguments for creating a Basic Authentication flow.
 */
interface CreateBasicAuthFlowArgs {
  /**
   * The type of authentication flow to create.
   */
  type: 'basic';
  /**
   * The username for Basic Authentication.
   */
  username?: string;
  /**
   * The password for Basic Authentication.
   */
  password?: string;
}

/**
 * Creates an OAuth 2.0 PKCE (Proof Key for Code Exchange) authentication flow for X (formerly Twitter) API.
 * @see {@link https://docs.x.com/resources/fundamentals/authentication/oauth-2-0/authorization-code | X OAuth 2.0 Authorization Code with PKCE Documentation}
 *
 * @param args - Configuration object for OAuth 2.0 PKCE flow
 * @returns An OAuth 2.0 Authorization Code PKCE flow instance configured for X API
 *
 * @example
 * ```typescript
 * const pkceFlow = createAuthFlow({
 *   type: 'oauth2:pkce',
 *   clientId: 'your-client-id',
 *   clientSecret: 'optional-client-secret'
 * });
 * ```
 */
function createAuthFlow(args: CreateOAuth2PKCEFlowArgs): OAuth2AuthorizationCodePKCEFlow<OAuth2Scopes>;
/**
 * Creates an OAuth 2.0 Client Credentials authentication flow for X (formerly Twitter) API.
 * @see {@link https://docs.x.com/resources/fundamentals/authentication/oauth-2-0/application-only | X OAuth 2.0 Application-only Documentation}
 *
 * @param args - Configuration object for OAuth 2.0 Client Credentials flow
 * @returns An OAuth 2.0 Client Credential flow instance configured for X API
 *
 * @example
 * ```typescript
 * const clientFlow = createAuthFlow({
 *   type: 'oauth2:client_credentials',
 *   consumerKey: 'your-consumer-key',
 *   consumerSecret: 'your-consumer-secret'
 * });
 * ```
 */
function createAuthFlow(args: CreateOAuth2ClientCredentialsFlowArgs): OAuth2ClientCredentialFlow;
/**
 * OAuth 1a authentication flow creation - currently not supported.
 * @see {@link https://docs.x.com/resources/fundamentals/authentication/oauth-1-0a/obtaining-user-access-tokens | X OAuth 1.0a User Access Tokens (3-legged OAuth) Documentation}
 *
 * @param args - Configuration object for OAuth 1a flow
 * @returns Never returns - always throws an error
 */
function createAuthFlow(args: CreateOAuth1aFlowArgs): never;
/**
 * HTTP Basic authentication flow creation - currently not supported.
 * @see {@link https://docs.x.com/resources/fundamentals/authentication/basic-auth | X Basic Auth Documentation}
 *
 * @param args - Configuration object for HTTP Basic Authentication flow
 * @returns Never returns - always throws an error
 */
// eslint-disable-next-line @typescript-eslint/unified-signatures -- explicit overload
function createAuthFlow(args: CreateBasicAuthFlowArgs): never;
function createAuthFlow(
  args:
    | CreateOAuth2PKCEFlowArgs
    | CreateOAuth2ClientCredentialsFlowArgs
    | CreateOAuth1aFlowArgs
    | CreateBasicAuthFlowArgs,
): OAuth2AuthorizationCodePKCEFlow<OAuth2Scopes> | OAuth2ClientCredentialFlow {
  if (args.type === 'oauth2:pkce') {
    return new OAuth2AuthorizationCodePKCEFlow(oauth2Server, args.clientId, args.clientSecret, clientAuth);
  }
  if (args.type === 'oauth2:client_credentials') {
    return new OAuth2ClientCredentialFlow(oauth2Server, args.consumerKey, args.consumerSecret, clientAuth);
  }

  throw new Error(`Unsupported auth method: ${args.type}`);
}

export { createAuthFlow };
export type {
  OAuth2Scopes,
  CreateOAuth2PKCEFlowArgs,
  CreateOAuth2ClientCredentialsFlowArgs,
  CreateOAuth1aFlowArgs,
  CreateBasicAuthFlowArgs,
};
