import { type CookieSession, type OAuthSession, type ReadonlySession } from '@social-sdk/auth/session';

/**
 * Abstract base class for API clients that handle session management.
 */
export abstract class APIClient<T extends ReadonlySession> {
  constructor(protected session: T) {}
}

/**
 * Represents a client for public API endpoints that require OAuth authentication.
 * This client uses an OAuth session for managing access tokens and session data.
 */
export abstract class PublicAPIClient<T extends OAuthSession> extends APIClient<T> {
  constructor(protected override session: T) {
    super(session);
  }
}

/**
 * Represents a client for private API endpoints that require cookie-based session management.
 * This client uses a cookie session for managing session data.
 */
export abstract class PrivateAPIClient<T extends CookieSession> extends APIClient<T> {
  constructor(protected override session: T) {
    super(session);
  }
}
