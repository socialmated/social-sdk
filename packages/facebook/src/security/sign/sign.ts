import { createHmac } from 'node:crypto';

/**
 * Represents the generated app secret proof.
 */
interface AppSecretProof {
  /**
   * The generated proof string.
   */
  proof: string;
  /**
   * The time when the proof was generated, in milliseconds since the epoch.
   */
  time: number;
}

/**
 * Generates the app secret proof for a given access token.
 * @see {@link https://developers.facebook.com/docs/facebook-login/security#proof | Facebook Login - Login Security}
 *
 * @param appSecret - The app secret used to generate the proof.
 * @param accessToken - The access token for which the proof is generated.
 * @param time - The time when the proof is generated, defaults to the current time.
 * @returns An object containing the generated proof and the time it was generated.
 */
function generateProof(appSecret: string, accessToken: string, time = Date.now()): AppSecretProof {
  const data = `${accessToken}|${String(time)}`;
  const proof = createHmac('sha256', appSecret).update(data).digest('hex');

  return { proof, time };
}

export { generateProof };
export type { AppSecretProof };
