import { type OAuth2Credential } from '@social-sdk/auth/credential';
import {
  OAuth2AuthorizationCodePKCEFlow,
  OAuth2ClientCredentialsFlow,
  type ServerMetadata,
} from '@social-sdk/auth/flow';
import { type TupleToUnion } from 'type-fest';
import { PageCredentialFlow } from './flow.js';
import { type PageCredential } from './credential.js';

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

/**
 * Creates an OAuth 2.0 Client Credentials authentication flow for Facebook API.
 *
 * @param args - Configuration arguments for the OAuth 2.0 Client Credentials flow.
 * @returns An OAuth 2.0 Client Credentials flow instance configured for Facebook API.
 */
function createAuthFlow(args: { type: 'oauth2:client_credentials' } & OAuth2Credential): OAuth2ClientCredentialsFlow;

/**
 * Creates an OAuth 2.0 Authorization Code authentication flow for Facebook API.
 *
 * @param args - Configuration arguments for the OAuth 2.0 Authorization Code flow.
 * @returns An OAuth 2.0 Authorization Code flow instance configured for Facebook API.
 */
function createAuthFlow(args: { type: 'oauth2:authorization_code' } & OAuth2Credential): never;

/**
 * Creates an OAuth 2.0 Authorization Code with PKCE authentication flow for Facebook API.
 *
 * @param args - Configuration arguments for the OAuth 2.0 Authorization Code PKCE flow.
 * @returns An OAuth 2.0 Authorization Code PKCE flow instance configured for Facebook API.
 */
function createAuthFlow(
  args: { type: 'oauth2:authorization_code_pkce' } & OAuth2Credential,
): OAuth2AuthorizationCodePKCEFlow<OAuth2Scopes>;

/**
 * Creates an OAuth 2.0 Implicit authentication flow for Facebook API.
 * @param args - Configuration arguments for the OAuth 2.0 Implicit flow.
 * @returns An OAuth 2.0 Implicit flow instance configured for Facebook API.
 */
// eslint-disable-next-line @typescript-eslint/unified-signatures -- explicit overload
function createAuthFlow(args: { type: 'oauth2:implicit' } & OAuth2Credential): never;

/**
 * Creates an Page Credentials authentication flow for Facebook API.
 *
 * @param args - Configuration arguments for the Page Credentials flow.
 * @returns An Page Credentials flow instance configured for Facebook API.
 */
function createAuthFlow(args: { type: 'page_credential' } & PageCredential): PageCredentialFlow;

function createAuthFlow(
  args:
    | ({ type: 'oauth2:client_credentials' } & OAuth2Credential)
    | ({ type: 'oauth2:authorization_code' } & OAuth2Credential)
    | ({ type: 'oauth2:authorization_code_pkce' } & OAuth2Credential)
    | ({ type: 'oauth2:implicit' } & OAuth2Credential)
    | ({ type: 'page_credential' } & PageCredential),
): OAuth2ClientCredentialsFlow | OAuth2AuthorizationCodePKCEFlow<OAuth2Scopes> | PageCredentialFlow | never {
  switch (args.type) {
    case 'oauth2:client_credentials':
      return new OAuth2ClientCredentialsFlow(server, args.clientId, args.clientSecret);
    case 'oauth2:authorization_code':
      throw new Error('OAuth 2.0 Authorization Code flow is not supported in this context.');
    case 'oauth2:authorization_code_pkce':
      return new OAuth2AuthorizationCodePKCEFlow(server, args.clientId, args.clientSecret);
    case 'oauth2:implicit':
      throw new Error('OAuth 2.0 Implicit flow is not supported in this context.');
    case 'page_credential':
      return new PageCredentialFlow(args);
  }
}

export { createAuthFlow };
export type { OAuth2Scopes };
