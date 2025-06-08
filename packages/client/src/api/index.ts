import { type CookieSession, type OAuthSession, type ReadonlySession } from '@social-sdk/auth/session';

export abstract class APIClient<T extends ReadonlySession> {
  constructor(protected session: T) {}
}

export class PublicAPIClient<T extends OAuthSession> extends APIClient<T> {
  constructor(protected override session: T) {
    super(session);
  }
}

export class PrivateAPIClient<T extends CookieSession> extends APIClient<T> {
  constructor(protected override session: T) {
    super(session);
  }
}
