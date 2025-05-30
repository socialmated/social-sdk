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
 * This function adds an Authorization header with Basic authentication credentials
 * when a client secret is available. The credentials are base64-encoded in the format
 * "client_id:client_secret".
 *
 * @param _as - Authorization server configuration (unused)
 * @param client - OAuth client configuration containing client_id and optional client_secret
 * @param _body - Request body (unused)
 * @param headers - HTTP headers object to modify with authentication credentials
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

// TODO: use function overloads to handle different auth methods
type CreateAuthFlowArgs =
  | {
      method: 'oauth2:pkce';
      clientId?: string;
      clientSecret?: string;
    }
  | {
      method: 'oauth2:client_credentials';
      consumerKey?: string;
      consumerSecret?: string;
    }
  | {
      method: 'oauth1a';
      consumerKey?: string;
      consumerSecret?: string;
    }
  | {
      method: 'basic';
      username?: string;
      password?: string;
    };

type AuthFlowMethods = CreateAuthFlowArgs['method'];

type CreateAuthFlowReturnType<T extends AuthFlowMethods> = T extends 'oauth2:pkce'
  ? OAuth2AuthorizationCodePKCEFlow<OAuth2Scopes>
  : T extends 'oauth2:client_credentials'
    ? OAuth2ClientCredentialFlow
    : never;

const createAuthFlow = <T extends AuthFlowMethods>(
  args: Extract<CreateAuthFlowArgs, { method: T }>,
): CreateAuthFlowReturnType<T> => {
  if (args.method === 'oauth2:pkce') {
    const { clientId, clientSecret } = args as Extract<CreateAuthFlowArgs, { method: 'oauth2:pkce' }>;
    return new OAuth2AuthorizationCodePKCEFlow(
      oauth2Server,
      clientId,
      clientSecret,
      clientAuth,
    ) as CreateAuthFlowReturnType<T>;
  }
  if (args.method === 'oauth2:client_credentials') {
    const { consumerKey, consumerSecret } = args as Extract<
      CreateAuthFlowArgs,
      { method: 'oauth2:client_credentials' }
    >;
    return new OAuth2ClientCredentialFlow(
      oauth2Server,
      consumerKey,
      consumerSecret,
      clientAuth,
    ) as CreateAuthFlowReturnType<T>;
  }

  throw new Error(`Unsupported auth method: ${args.method}`);
};

export { createAuthFlow };
export type { CreateAuthFlowArgs, OAuth2Scopes };
