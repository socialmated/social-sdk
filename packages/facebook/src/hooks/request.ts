import { type BeforeRequestHook } from '@social-sdk/client/http';
import { setRequestSearchParams } from '@social-sdk/client/hooks';
import { type AppSecretProofSigner } from '@/security/sign/signer.js';

export const signAppSecretProof =
  (signer: AppSecretProofSigner): BeforeRequestHook =>
  async (options) => {
    const { proof, time } = signer.sign(options);
    return setRequestSearchParams({
      appsecret_proof: proof,
      appsecret_time: String(time),
    })(options);
  };
