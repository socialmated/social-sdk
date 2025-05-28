import { type Options } from 'got';
import { type Signer } from '@social-sdk/core/security';
import { HomeHtmlParser, OnDemandJsParser } from './parser.js';
import { transactionId, deriveAnimationKey, decodeVerificationKey } from './sign.js';

/**
 * Generates and signs the transaction ID for X's API requests.
 *
 * @example
 * ```typescript
 * const signer = new TransactionIdSigner();
 * const transactionId = await signer.sign('POST', '/i/api/1.1/some-endpoint.json');
 * console.log(transactionId);
 * ```
 *
 * @public
 */
class TransactionIdSigner implements Signer<string> {
  /**
   * The cryptographic verification key extracted from the homepage.
   */
  private key?: Uint8Array;

  /**
   * The animation key derived from homepage animation data.
   */
  private animationKey?: string;

  /**
   * Generates and signs a transaction ID for a given HTTP method and API endpoint path.
   *
   * @param method - The HTTP method (e.g., 'GET', 'POST').
   * @param path - The API endpoint path (e.g., '/api/endpoint').
   * @param options - The got Options object.
   * @returns Promise resolving to a Base64-encoded transaction ID string.
   * @throws Error if the signer has not been initialized.
   */
  public async sign(method: string, path: string): Promise<string>;
  /**
   * Generates and signs a transaction ID for a `got` request {@link Options}.
   *
   * @param opts - The `got` request {@link Options} object.
   * @returns Promise resolving to a Base64-encoded transaction ID string.
   * @throws Error if the signer has not been initialized.
   */
  public async sign(opts: Options): Promise<string>;
  /**
   * Generates and signs a transaction ID for a `fetch` {@link Request}.
   *
   * @param req - The `fetch` request {@link Request} object.
   * @returns Promise resolving to a Base64-encoded transaction ID string.
   * @throws Error if the signer has not been initialized or if invalid arguments are provided.
   */
  // eslint-disable-next-line @typescript-eslint/unified-signatures -- explicitly overload
  public async sign(req: Request): Promise<string>;
  public async sign(arg1: string | Options | Request, arg2?: string): Promise<string> {
    if (!this.key || !this.animationKey) {
      await this.init();
    }

    let method: string;
    let requestPath: string;
    if (typeof arg1 === 'string') {
      method = arg1;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- expected to be defined at this point
      requestPath = arg2!;
    } else {
      method = arg1.method;
      requestPath = arg1.url ? new URL(arg1.url).pathname : '';
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- expected to be defined at this point
    return transactionId(method, requestPath, this.key!, this.animationKey!);
  }

  /**
   * Initializes the instance by extracting cryptographic keys and animation data.
   * This method must be called before signing transaction IDs.
   *
   * @returns Promise that resolves when initialization is complete.
   * @throws Error if required data cannot be extracted.
   */
  private async init(): Promise<void> {
    if (this.key !== undefined && this.animationKey !== undefined) {
      // Already initialized
      return;
    }

    // Create parsers for the homepage and ondemand JavaScript file.
    const htmlParser = await HomeHtmlParser.create();
    const jsParser = await OnDemandJsParser.create(htmlParser.findOnDemandJsChunkHash());

    // Extract the verification key from the homepage.
    const verificationKey = htmlParser.getVerificationKey();
    if (!verificationKey) {
      throw new Error("Couldn't extract verification key from the homepage");
    }
    this.key = decodeVerificationKey(verificationKey);

    // Derive the animation key from SVG frames and specific indices.
    const frames = htmlParser.getAnimationFrames();
    const indices = jsParser.getIndices();
    this.animationKey = deriveAnimationKey(this.key, indices, frames);
  }
}

export { TransactionIdSigner };
