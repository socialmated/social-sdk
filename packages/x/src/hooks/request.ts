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
 * Creates a before-request hook that sets session headers for X's API requests.
 * Includes CSRF token, guest token, and bearer token.
 *
 * @param session - The X cookie session containing authentication cookies
 * @returns Before-request hook for HTTP clients
 */
const setSessionHeaders = (session: XCookieSession): BeforeRequestHook =>
  setRequestHeaders({
    'x-csrf-token': session.get('ct0'),
    'x-guest-token': session.get('gt'),
    authorization: `Bearer ${getBearerToken()}`,
  });

export { signTransactionId, setSessionHeaders };
