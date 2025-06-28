import { createHmac } from 'node:crypto';

interface AppSecretProof {
  proof: string;
  time: number;
}

function generateProof(appSecret: string, accessToken: string, time = Date.now()): AppSecretProof {
  const data = `${accessToken}|${String(time)}`;
  const proof = createHmac('sha256', appSecret).update(data).digest('hex');

  return { proof, time };
}

export { generateProof };
export type { AppSecretProof };
