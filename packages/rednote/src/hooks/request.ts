import { type BeforeRequestHook } from 'got';
import { setRequestHeaders } from '@social-sdk/client/hooks';
import { type XhsSigner } from '@/security/sign/signer.js';
import { type XSCommonGenerator } from '@/security/fingerprint/generator.js';
import { defaultConfig } from '@/client/config.js';
import { b3TraceId, xrayTraceId } from '@/security/instrument/trace.js';

/**
 * Creates a hook that signs HTTP requests using the provided XHS signer.
 *
 * @param signer - The XHS signer instance used to generate request signatures
 * @returns A before-request hook that adds signature headers (X-s, X-t, X-Mns) to the request
 */
const signRequest =
  (signer: XhsSigner): BeforeRequestHook =>
  (options) => {
    const sig = signer.sign(options);
    return setRequestHeaders({
      'X-s': sig['X-s'],
      'X-t': sig['X-t'],
      'X-Mns': sig['X-Mns'],
    })(options);
  };

/**
 * Creates a before-request hook that adds a fingerprint header to HTTP requests.
 *
 * @param generator - The XSCommonGenerator instance used to generate fingerprints
 * @returns A BeforeRequestHook function that adds the 'X-S-Common' header with the generated fingerprint
 */
const addFingerprint =
  (generator: XSCommonGenerator): BeforeRequestHook =>
  (options) => {
    const fingerprint = generator.generate(defaultConfig.platform, options);
    return setRequestHeaders({
      'X-S-Common': fingerprint,
    })(options);
  };

/**
 * Sets up distributed tracing headers for HTTP requests.
 * Generates B3 and X-Ray trace IDs and adds them to request headers.
 *
 * @param options - The request options object to modify with tracing headers
 */
const setupTracing: BeforeRequestHook = setRequestHeaders({
  'x-b3-traceid': b3TraceId(),
  'x-xray-traceid': xrayTraceId(),
});

export { signRequest, addFingerprint, setupTracing };
