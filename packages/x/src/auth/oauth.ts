import {
  type ClientAuth,
  type ServerMetadata,
  OAuth2AuthorizationCodePKCEFlow,
  OAuth2ClientCredentialFlow,
} from '@social-sdk/core/auth/flow';

const oauth2Server: ServerMetadata = {
  issuer: 'https://x.com',
  authorization_endpoint: 'https://x.com/i/oauth2/authorize',
  token_endpoint: 'https://api.x.com/2/oauth2/token',
};

const clientAuth: ClientAuth = (_as, client, _body, headers) => {
  if (client.client_secret) {
    const encoded = Buffer.from(`${client.client_id}:${client.client_secret}`).toString('base64');
    headers.set('Authorization', `Basic ${encoded}`);
  }
};

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

type CreateAuthFlowReturnType<T extends CreateAuthFlowArgs['method']> = T extends 'oauth2:pkce'
  ? OAuth2AuthorizationCodePKCEFlow<OAuth2Scopes>
  : T extends 'oauth2:client_credentials'
    ? OAuth2ClientCredentialFlow
    : undefined;

const createAuthFlow = <T extends CreateAuthFlowArgs['method']>(
  args: Extract<CreateAuthFlowArgs, { method: T }>,
): CreateAuthFlowReturnType<T> => {
  if (args.method === 'oauth2:pkce') {
    const _args = args as Extract<CreateAuthFlowArgs, { method: 'oauth2:pkce' }>;

    return new OAuth2AuthorizationCodePKCEFlow(
      oauth2Server,
      _args.clientId,
      _args.clientSecret,
      clientAuth,
    ) as CreateAuthFlowReturnType<T>;
  }
  if (args.method === 'oauth2:client_credentials') {
    const _args = args as Extract<CreateAuthFlowArgs, { method: 'oauth2:client_credentials' }>;

    return new OAuth2ClientCredentialFlow(
      oauth2Server,
      _args.consumerKey,
      _args.consumerSecret,
      clientAuth,
    ) as CreateAuthFlowReturnType<T>;
  }

  return undefined as CreateAuthFlowReturnType<T>;
};

export { createAuthFlow };
export type { CreateAuthFlowArgs, OAuth2Scopes };
