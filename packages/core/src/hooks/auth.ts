import { type BeforeRequestHook } from 'got';
import { type OAuthSession } from '@/auth/session/oauth.js';

export const setAuthorization =
  (session: OAuthSession): BeforeRequestHook =>
  async (options) => {
    if (session.expiresIn() <= 0) {
      await session.refresh();
    }
    options.headers['authorization'] = `Bearer ${session.tokenResponse.access_token}`;
  };
