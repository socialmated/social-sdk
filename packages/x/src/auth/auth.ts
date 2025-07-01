import { type OAuth1aCredential, type OAuth2Credential } from '@social-sdk/auth/credential';
import {
  type ClientAuth,
  type ServerMetadata,
  OAuth2AuthorizationCodePKCEFlow,
  OAuth2ClientCredentialsFlow,
} from '@social-sdk/auth/flow';
import { type TupleToUnion } from 'type-fest';

/**
 * OAuth 2.0 scopes available for X (formerly Twitter) API.
 * @see {@link https://docs.x.com/resources/fundamentals/authentication/oauth-2-0/authorization-code#scopes | X OAuth 2.0 Scopes Documentation}
 * @see {@link https://docs.x.com/resources/fundamentals/authentication/guides/v2-authentication-mapping | X OAuth 2.0 Scopes Mapping Documentation}
 */
const scopes = [
  'tweet.read',
  'tweet.write',
  'tweet.moderate.write',
  'users.read',
  'follows.read',
  'follows.write',
  'offline.access',
  'space.read',
  'mute.read',
  'mute.write',
  'like.read',
  'like.write',
  'list.read',
  'list.write',
  'block.read',
  'block.write',
  'bookmark.read',
  'bookmark.write',
  'dm.read',
  'dm.write',
] as const;

/**
 * Type representing the union of all OAuth 2.0 scopes available for X (formerly Twitter) API.
 */
type OAuth2Scopes = TupleToUnion<typeof scopes>;

/**
 * OAuth 2.0 server metadata configuration for X (formerly Twitter) API.
 * @see {@link https://docs.x.com/resources/fundamentals/authentication/api-reference | X OAuth API Reference}
 */
const server: ServerMetadata = {
  issuer: 'https://api.x.com',
  service_documentation: 'https://docs.x.com/resources/fundamentals/authentication/overview',
  authorization_endpoint: 'https://x.com/i/oauth2/authorize',
  token_endpoint: 'https://api.x.com/2/oauth2/token',
  revocation_endpoint: 'https://api.x.com/2/oauth2/invalidate_token',
  userinfo_endpoint: 'https://api.x.com/2/users/me',
  response_types_supported: ['code'],
  grant_types_supported: ['authorization_code', 'client_credentials', 'refresh_token'],
  scopes_supported: [...scopes],
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
 * Creates an OAuth 2.0 Authorization Code with PKCE authentication flow for X (formerly Twitter) API.
 * @see {@link https://docs.x.com/resources/fundamentals/authentication/oauth-2-0/authorization-code | X OAuth 2.0 Authorization Code with PKCE Documentation}
 *
 * @param args - Configuration arguments for OAuth 2.0 Authorization Code PKCE flow
 * @returns An OAuth 2.0 Authorization Code PKCE flow instance configured for X API
 */
function createAuthFlow(
  args: { type: 'oauth2:authorization_code_pkce' } & OAuth2Credential,
): OAuth2AuthorizationCodePKCEFlow<OAuth2Scopes>;

/**
 * Creates an OAuth 2.0 Client Credentials authentication flow for X (formerly Twitter) API.
 * @see {@link https://docs.x.com/resources/fundamentals/authentication/oauth-2-0/application-only | X OAuth 2.0 Application-only Documentation}
 *
 * @param args - Configuration arguments for OAuth 2.0 Client Credentials flow
 * @returns An OAuth 2.0 Client Credential flow instance configured for X API
 */
function createAuthFlow(args: { type: 'oauth2:client_credentials' } & OAuth2Credential): OAuth2ClientCredentialsFlow;

/**
 * OAuth 1a authentication flow creation - currently not supported.
 * @see {@link https://docs.x.com/resources/fundamentals/authentication/oauth-1-0a/obtaining-user-access-tokens | X OAuth 1.0a User Access Tokens (3-legged OAuth) Documentation}
 *
 * @param args - Configuration arguments for OAuth 1a flow
 * @returns Never returns - always throws an error
 */
function createAuthFlow(args: { type: 'oauth1a' } & OAuth1aCredential): never;

function createAuthFlow(
  args:
    | ({ type: 'oauth2:authorization_code_pkce' } & OAuth2Credential)
    | ({ type: 'oauth2:client_credentials' } & OAuth2Credential)
    | ({ type: 'oauth1a' } & OAuth1aCredential),
): OAuth2AuthorizationCodePKCEFlow<OAuth2Scopes> | OAuth2ClientCredentialsFlow | never {
  switch (args.type) {
    case 'oauth2:authorization_code_pkce':
      return new OAuth2AuthorizationCodePKCEFlow(server, args.clientId, args.clientSecret, clientAuth);
    case 'oauth2:client_credentials':
      return new OAuth2ClientCredentialsFlow(server, args.clientId, args.clientSecret, clientAuth);
    case 'oauth1a':
      throw new Error('OAuth 1a flow is not supported in this context.');
  }
}

export { createAuthFlow };
export type { OAuth2Scopes };
