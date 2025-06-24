import {
  OAuth2AuthorizationCodePKCEFlow,
  OAuth2ClientCredentialFlow,
  type ServerMetadata,
} from '@social-sdk/auth/flow';
import { type TupleToUnion } from 'type-fest';

/**
 * OAuth 2.0 scopes available for Facebook API.
 * @see {@link https://developers.facebook.com/docs/permissions | Permissions Reference for Meta Technologies APIs}
 */
const scopes = [
  'ads_management',
  'ads_read',
  'attribution_read',
  'business_management',
  'catalog_management',
  'commerce_account_manage_orders',
  'commerce_account_read_orders',
  'commerce_account_read_reports',
  'commerce_account_read_settings',
  'commerce_manage_accounts',
  'email',
  'gaming_user_locale',
  'instagram_basic',
  'instagram_branded_content_ads_brand',
  'instagram_branded_content_brand',
  'instagram_branded_content_creator',
  'instagram_business_basic',
  'instagram_business_content_publish',
  'instagram_business_manage_comments',
  'instagram_business_manage_messages',
  'instagram_content_publish',
  'instagram_graph_user_media',
  'instagram_graph_user_profile',
  'instagram_manage_comments',
  'instagram_manage_events',
  'instagram_manage_insights',
  'instagram_manage_messages',
  'instagram_shopping_tag_products',
  'instagram_manage_upcoming_events',
  'leads_retrieval',
  'manage_app_solutions',
  'manage_fundraisers',
  'pages_events',
  'pages_manage_ads',
  'pages_manage_cta',
  'pages_manage_instant_articles',
  'pages_manage_engagement',
  'pages_manage_metadata',
  'pages_manage_posts',
  'pages_messaging',
  'pages_read_engagement',
  'pages_read_user_content',
  'pages_show_list',
  'pages_user_gender',
  'pages_user_locale',
  'pages_user_timezone',
  'private_computation_access',
  'public_profile',
  'publish_video',
  'read_audience_network_insights',
  'read_insights',
  'threads_basic',
  'threads_business_basic',
  'threads_content_publish',
  'threads_delete',
  'threads_keyword_search',
  'threads_location_tagging',
  'threads_manage_insights',
  'threads_manage_mentions',
  'threads_manage_replies',
  'threads_read_replies',
  'user_age_range',
  'user_birthday',
  'user_friends',
  'user_gender',
  'user_hometown',
  'user_likes',
  'user_link',
  'user_location',
  'user_messenger_contact',
  'user_photos',
  'user_posts',
  'user_videos',
  'whatsapp_business_manage_events',
  'whatsapp_business_management',
  'whatsapp_business_messaging',
] as const;

/**
 * Type representing the union of all OAuth 2.0 scopes available for Facebook API.
 */
type OAuth2Scopes = TupleToUnion<typeof scopes>;

/**
 * OAuth 2.0 server metadata configuration for Facebook API.
 * @see {@link https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow | Facebook Login - Manually Build a Login Flow}
 */
const server: ServerMetadata = {
  issuer: 'https://graph.facebook.com',
  service_documentation: 'https://developers.facebook.com/docs/facebook-login',
  authorization_endpoint: 'https://www.facebook.com/v23.0/dialog/oauth',
  token_endpoint: 'https://graph.facebook.com/v23.0/oauth/access_token',
  introspection_endpoint: 'https://graph.facebook.com/debug_token',
  userinfo_endpoint: 'https://graph.facebook.com/me',
  response_types_supported: ['code', 'token', 'code token'],
  grant_types_supported: [
    'authorization_code',
    'client_credentials',
    'refresh_token',
    'implicit',
    'fb_attenuate_token',
    'fb_exchange_token',
  ],
  scopes_supported: [...scopes],
  display_values_supported: ['page', 'popup'],
};

interface CreateOAuth2AuthorizationCodeFlowArgs {
  type: 'oauth2:authorization_code';
  appId: string;
  appSecret?: string;
}

interface CreateOAuth2AuthorizationCodePKCEFlowArgs {
  type: 'oauth2:authorization_code:pkce';
  appId: string;
  appSecret?: string;
}

interface CreateOAuth2ImplicitFlowArgs {
  type: 'oauth2:implicit';
  appId: string;
  appSecret?: string;
}

interface CreateOAuth2ClientCredentialsFlowArgs {
  type: 'oauth2:client_credentials';
  appId: string;
  appSecret: string;
}

interface CreatePageAuthFlowArgs {
  type: 'page';
  userId: string;
  userAccessToken: string;
}

interface CreateClientAuthFlowArgs {
  type: 'client';
  appId: string;
  clientToken: string;
}

/**
 * Creates an OAuth 2.0 Client Credentials authentication flow for Facebook API.
 *
 * @param args - Configuration arguments for the OAuth 2.0 Client Credentials flow.
 * @returns An OAuth 2.0 Client Credentials flow instance configured for Facebook API.
 */
function createAuthFlow(args: CreateOAuth2ClientCredentialsFlowArgs): OAuth2ClientCredentialFlow;
/**
 * Creates an OAuth 2.0 Authorization Code authentication flow for Facebook API.
 *
 * @param args - Configuration arguments for the OAuth 2.0 Authorization Code flow.
 * @returns An OAuth 2.0 Authorization Code flow instance configured for Facebook API.
 */
function createAuthFlow(args: CreateOAuth2AuthorizationCodeFlowArgs): never;
/**
 * Creates an OAuth 2.0 Authorization Code with PKCE authentication flow for Facebook API.
 *
 * @param args - Configuration arguments for the OAuth 2.0 Authorization Code PKCE flow.
 * @returns An OAuth 2.0 Authorization Code PKCE flow instance configured for Facebook API.
 */
function createAuthFlow(args: CreateOAuth2AuthorizationCodePKCEFlowArgs): OAuth2AuthorizationCodePKCEFlow<OAuth2Scopes>;
/**
 * Creates an OAuth 2.0 Implicit authentication flow for Facebook API.
 * @param args - Configuration arguments for the OAuth 2.0 Implicit flow.
 * @returns An OAuth 2.0 Implicit flow instance configured for Facebook API.
 */
// eslint-disable-next-line @typescript-eslint/unified-signatures -- explicit overload
function createAuthFlow(args: CreateOAuth2ImplicitFlowArgs): never;
/**
 * Creates a Page Access Token authentication flow for Facebook API.
 *
 * @param args - Configuration arguments for the Page Access Token flow.
 * @returns A Page Access Token flow instance configured for Facebook API.
 */
// eslint-disable-next-line @typescript-eslint/unified-signatures -- explicit overload
function createAuthFlow(args: CreatePageAuthFlowArgs): never;
/**
 * Creates a Client Access Token authentication flow for Facebook API.
 * @param args - Configuration arguments for the Client Access Token flow.
 * @returns A Client Access Token flow instance configured for Facebook API.
 */
// eslint-disable-next-line @typescript-eslint/unified-signatures -- explicit overload
function createAuthFlow(args: CreateClientAuthFlowArgs): never;
function createAuthFlow(
  args:
    | CreateOAuth2ClientCredentialsFlowArgs
    | CreateOAuth2AuthorizationCodeFlowArgs
    | CreateOAuth2AuthorizationCodePKCEFlowArgs
    | CreateOAuth2ImplicitFlowArgs
    | CreatePageAuthFlowArgs
    | CreateClientAuthFlowArgs,
): OAuth2ClientCredentialFlow | OAuth2AuthorizationCodePKCEFlow<OAuth2Scopes> {
  switch (args.type) {
    case 'oauth2:client_credentials':
      return new OAuth2ClientCredentialFlow(server, args.appId, args.appSecret);
    case 'oauth2:authorization_code':
      throw new Error('OAuth 2.0 Authorization Code flow is not supported in this context.');
    case 'oauth2:authorization_code:pkce':
      return new OAuth2AuthorizationCodePKCEFlow(server, args.appId, args.appSecret);
    case 'oauth2:implicit':
      throw new Error('OAuth 2.0 Implicit flow is not supported in this context.');
    case 'page':
      throw new Error('Page Access Token flow is not supported in this context.');
    case 'client':
      throw new Error('Client Access Token flow is not supported in this context.');
  }
}

export { createAuthFlow };
export type {
  OAuth2Scopes,
  CreateOAuth2AuthorizationCodeFlowArgs,
  CreateOAuth2AuthorizationCodePKCEFlowArgs,
  CreateOAuth2ImplicitFlowArgs,
  CreateOAuth2ClientCredentialsFlowArgs,
  CreatePageAuthFlowArgs,
  CreateClientAuthFlowArgs,
  OAuth2ClientCredentialFlow,
  OAuth2AuthorizationCodePKCEFlow,
};
