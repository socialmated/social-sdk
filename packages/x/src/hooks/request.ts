import { type BeforeRequestHook } from 'got';
import { setRequestHeader, setRequestHeaders } from '@social-sdk/core/hooks';
import { type TransactionIdSigner } from '@/security/sign/signer.js';
import { type XCookieSession } from '@/auth/session.js';
import { getBearerToken } from '@/security/token/index.js';

/**
 * Creates a before-request hook that signs the transaction ID for X's API requests.
 *
 * @param signer - The TransactionIdSigner instance used to sign the transaction ID
 * @returns Before-request hook for HTTP clients
 */
const signTransactionId = (signer: TransactionIdSigner): BeforeRequestHook =>
  setRequestHeader('x-client-transaction-id', (options) => signer.sign(options));

/**
 * Creates a before-request hook that sets up authentication headers for X API requests.
 *
 * @param session - The X cookie session containing authentication tokens
 * @returns Before-request hook that applies authentication headers
 */
const setupSession = (session: XCookieSession): BeforeRequestHook =>
  setRequestHeaders({
    'x-csrf-token': session.expiresIn('ct0') <= 0 ? session.refresh('ct0') : session.get('ct0'),
    'x-guest-token': session.expiresIn('gt') <= 0 ? session.refresh('gt') : session.get('gt'),
    authorization: `Bearer ${getBearerToken()}`,
  });

export { signTransactionId, setupSession };
