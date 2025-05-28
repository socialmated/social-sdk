import { JSDOM, type BinaryData } from 'jsdom';
import { HeaderGenerator } from 'header-generator';
import { gotScraping } from 'got-scraping';

/**
 * Parses X (formerly Twitter) homepage HTML to extract key information required for signing transactions.
 *
 * @remarks
 * - The parser relies on specific HTML patterns present in the X homepage.
 * - If the homepage structure changes, the parser may need to be updated accordingly.
 *
 * @public
 */
class HomeHtmlParser {
  /**
   * Regular expression to extract the ondemand JavaScript file chunk hash from the homepage HTML.
   * The hash is used to construct the URL for fetching the ondemand file.
   */
  private static readonly ON_DEMAND_FILE_REGEX = /['"]ondemand\.s['"]:\s*['"](?<hash>\w*)['"]/;

  /**
   * The document object representing the homepage HTML.
   * This is used to query and manipulate the DOM for extracting information.
   */
  private homeDocument: Document;

  /**
   * Constructs a new parser instance from the homepage HTML.
   * @param htmlText - The HTML content of X's homepage as a string, Buffer, or BinaryData.
   */
  constructor(htmlText: string | Buffer | BinaryData) {
    this.homeDocument = new JSDOM(htmlText).window.document;
  }

  /**
   * Creates a new instance of {@link HomeHtmlParser} by fetching the homepage HTML from x.com.
   *
   * @returns A promise that resolves to a {@link HomeHtmlParser} instance containing the fetched homepage HTML.
   * @throws If the homepage cannot be fetched successfully.
   */
  public static async create(): Promise<HomeHtmlParser> {
    const homeHtml = await gotScraping('https://x.com/home').buffer();
    return new HomeHtmlParser(homeHtml);
  }

  /**
   * Retrieves SVG animation frame elements from the homepage HTML.
   * Frames are identified by element IDs starting with 'loading-x-anim'.
   *
   * @returns Array of SVG frame elements.
   */
  public getAnimationFrames(): SVGElement[] {
    return Array.from(this.homeDocument.querySelectorAll("[id^='loading-x-anim']"));
  }

  /**
   * Locates and fetches the ondemand JavaScript file referenced in the homepage HTML.
   * The file is required for extracting key byte indices used in transaction ID generation.
   *
   * @returns The content of the ondemand file as a string.
   * @throws Error if the ondemand file cannot be found or fetched.
   */
  public findOnDemandJsChunkHash(): string {
    // Serialize the homepage HTML for regex searching.
    const responseStr = this.homeDocument.documentElement.outerHTML;

    // Extract the chunk hash for the ondemand file.
    const onDemandFileMatch = HomeHtmlParser.ON_DEMAND_FILE_REGEX.exec(responseStr);
    const chunkHash = onDemandFileMatch?.groups?.['hash'];
    if (!chunkHash) {
      throw new Error("Couldn't extract ondemand file chunk hash from the page source");
    }

    return chunkHash;
  }
  /**
   * Extracts the verification key from the homepage HTML.
   * The verification key is stored in a meta tag with the name 'twitter-site-verification'.
   *
   * @returns The verification key as a string.
   * @throws Error if the verification key cannot be found.
   */
  public getVerificationKey(): string | null {
    // Find the meta tag containing the verification key.
    const element = this.homeDocument.querySelector("[name='twitter-site-verification']");
    if (!element) {
      throw new Error("Couldn't find meta tag with name 'twitter-site-verification'");
    }

    return element.getAttribute('content');
  }
}

/**
 * Parses a remote ondemand JavaScript file to extract cryptographic key byte indices.
 *
 * @remarks
 * - The ondemand JavaScript file is fetched from a Twitter CDN using a provided chunk hash.
 * - The indices are extracted using a regular expression and are expected to change frequently.
 *
 * @public
 */
class OnDemandJsParser {
  /**
   * Regular expression to extract key byte indices from the ondemand JavaScript file.
   * The indices are used for cryptographic key derivation.
   */
  private static readonly INDICES_REGEX = /\(\w\[(?<index>\d{1,2})\],\s*16\)/g;

  /**
   * Constructs a new parser instance from the ondemand JavaScript file content.
   * @param sourceCode - The JavaScript source code of the ondemand file as a string.
   */
  constructor(private sourceCode: string) {}

  /**
   * Creates an instance of `OnDemandJsParser` by fetching and parsing a remote JavaScript file
   * identified by the provided `chunkHash`.
   *
   * @param chunkHash - The hash string used to construct the URL for the ondemand JavaScript file.
   * @returns A promise that resolves to an `OnDemandJsParser` instance containing the fetched JavaScript content.
   * @throws If the fetch request fails or the response is not OK.
   */
  public static async create(chunkHash: string): Promise<OnDemandJsParser> {
    const jsResponse = await fetch(`https://abs.twimg.com/responsive-web/client-web/ondemand.s.${chunkHash}a.js`, {
      // Requests will be blocked if user-agent is unknown.
      headers: new HeaderGenerator().getHeaders(),
    });
    if (!jsResponse.ok) {
      throw new Error(`Failed to fetch ondemand file: ${jsResponse.statusText}`);
    }

    const jsContent = await jsResponse.text();

    return new OnDemandJsParser(jsContent);
  }

  /**
   * Extracts key byte indices from the ondemand file content.
   * These indices are used for cryptographic key derivation.
   * Keep in mind that these indices changes frequently.
   *
   * @param onDemandFile - The text content of the ondemand file. If omitted, uses the last fetched file.
   * @returns Tuple of [rowIndex, keyByteIndices], where keyByteIndices is an array of three numbers.
   * @throws Error if the key byte indices cannot be extracted.
   */
  public getIndices(): [number, number, number, number] {
    const keyByteIndices: number[] = [];

    // Extract all index matches using the regex.
    const matches = Array.from(this.sourceCode.matchAll(OnDemandJsParser.INDICES_REGEX));
    for (const match of matches) {
      const index = match.groups?.['index'];
      if (!index) {
        throw new Error("Couldn't extract index from regex match");
      }
      keyByteIndices.push(parseInt(index, 10));
    }

    return keyByteIndices as [number, number, number, number];
  }
}

export { HomeHtmlParser, OnDemandJsParser };
