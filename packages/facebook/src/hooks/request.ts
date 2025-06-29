import { type BeforeRequestHook } from '@social-sdk/client/http';
import { setRequestSearchParams } from '@social-sdk/client/hooks';
import { type AppSecretProofSigner } from '@/security/sign/signer.js';

/**
 * Creates a BeforeRequestHook that signs the request with appsecret_proof and appsecret_time parameters.
 * @see {@link https://developers.facebook.com/docs/facebook-login/security#proof | Facebook Login - Login Security}
 *
 * @param signer - The AppSecretProofSigner instance used to sign the request
 * @returns A BeforeRequestHook that adds appsecret_proof and appsecret_time to the request search parameters
 */
export const signAppSecretProof =
  (signer: AppSecretProofSigner): BeforeRequestHook =>
  async (options) => {
    const { proof, time } = signer.sign(options);
    return setRequestSearchParams({
      appsecret_proof: proof,
      appsecret_time: String(time),
    })(options);
  };
