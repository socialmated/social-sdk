import { type Signer } from '@social-sdk/client/security';
import { type Options } from '@social-sdk/client/http';
import { generateProof, type AppSecretProof } from './sign.js';

export class AppSecretProofSigner implements Signer<AppSecretProof> {
  constructor(private readonly appSecret: string) {}

  public sign(req: Options): AppSecretProof {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- should be defined in the request
    const accessToken = new URLSearchParams(new URL(req.url!).searchParams).get('access_token');
    if (!accessToken) {
      throw new Error('Access token is required to generate App Secret Proof');
    }

    return generateProof(this.appSecret, accessToken);
  }
}
