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
   * Generates and signs a transaction ID for API requests.
   *
   * @param request - The request options.
   * @returns A Promise that resolves to the signed transaction ID.
   * @throws Error if the signer has not been initialized.
   */
  public async sign(request: Options): Promise<string> {
    if (!this.key || !this.animationKey) {
      await this.init();
    }

    const method = request.method;
    const path = request.url ? new URL(request.url).pathname : '';
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- expected to be defined at this point
    return transactionId(method, path, this.key!, this.animationKey!);
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
