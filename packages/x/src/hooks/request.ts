import { setRequestHeader, setRequestHeaders } from '@social-sdk/client/hooks';
import { type BeforeRequestHook } from '@social-sdk/client/http';
import { type TransactionIdSigner } from '@/security/sign/signer.js';
import { type XCookieSession } from '@/auth/session.js';
import { getBearerToken } from '@/security/token/index.js';
import { type XPFwdForGenerator } from '@/security/fingerprint/generator.js';

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
    'x-csrf-token': session.get('ct0') ?? session.refresh('ct0'),
    'x-guest-token': session.get('gt') ?? session.refresh('gt'),
    authorization: `Bearer ${getBearerToken()}`,
  });

/**
 * Creates a before-request hook that adds the 'x-xp-forwarded-for' header.
 *
 * @param generator - Generator for the forwarded-for value
 * @returns Before-request hook that sets the header
 */
const addForwardedFor = (generator: XPFwdForGenerator): BeforeRequestHook =>
  setRequestHeader(
    'x-xp-forwarded-for',
    generator.generate().then((output) => output.str),
  );

export { signTransactionId, setupSession, addForwardedFor };
