import { type Options } from 'got';
import { type Promisable } from 'type-fest';

export interface Signer<T> {
  sign: (req: Options) => Promisable<T>;
}
