import { type OAuthSession } from '@social-sdk/auth/session';
import { PublicAPIClient } from '@social-sdk/client/api';

export class XPublicAPIClient extends PublicAPIClient<OAuthSession> {}
