import { type Options } from 'got';

export interface Signer<T> {
  sign: ((req: Options) => Promise<T>) & ((req: Request) => Promise<T>);
}
