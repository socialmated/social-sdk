import 'golang-wasm-exec';
import { loadWasmModule } from './wasm.js';
import { type XCookieSession } from '@/auth/session.js';

declare global {
  /**
   * The global function that will be set by the WebAssembly module to generate the XP-Forwarded-For string.
   */
  var getForwardedForStr: (() => Promise<{ str: string; expiryTimeMillis: string }>) | undefined;
}

/**
 * Generates a XP-Forwarded-For string using a WebAssembly module.
 *
 * @example
 * ```typescript
 * const session = new XCookieSession();
 * const generator = new XPFwdForGenerator(session);
 * const result = await generator.generate();
 * console.log(result.str); // The generated XP-Forwarded-For string
 * console.log(result.expiryTimeMillis); // The expiry time in milliseconds
 * ```
 */
export class XPFwdForGenerator {
  /**
   * Creates an instance of XPFwdForGenerator.
   * This constructor initializes the global navigator and document properties
   * to simulate a browser environment for the WebAssembly module.
   *
   * @param session - The XCookieSession used to retrieve cookies for the request.
   */
  constructor(session: XCookieSession) {
    Object.assign(globalThis.navigator, {
      userActivation: {
        hasBeenActive: false,
      },
    });
    Object.defineProperty(globalThis.navigator, 'userAgent', {
      get: () =>
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
      configurable: true,
    });
    Object.defineProperty(globalThis, 'document', {
      value: {
        cookie: session.cookieJar.getCookieStringSync(session.issuer.toString()),
      },
    });
  }

  /**
   * Generates a XP-Forwarded-For string using the WebAssembly module.
   *
   * @returns A promise that resolves to an object containing the generated XP-Forwarded-For string and its expiry time in milliseconds.
   */
  public async generate(): Promise<{
    str: string;
    expiryTimeMillis: string;
  }> {
    if (!globalThis.getForwardedForStr) {
      await this.init();
    }

    if (typeof globalThis.getForwardedForStr === 'function') {
      const res = await globalThis.getForwardedForStr();
      return res;
    }

    throw new Error('Wasm module did not set window.getForwardedForStr');
  }

  /**
   * Initializes the WebAssembly module and sets up the global getForwardedForStr function.
   * This method must be called before generating the XP-Forwarded-For string.
   *
   * @returns A promise that resolves when the initialization is complete.
   */
  private async init(): Promise<void> {
    const go = new Go();
    try {
      const module = await loadWasmModule({
        ...go.importObject,
        env: {
          ...go.importObject['env'],
          memory: go.importObject['env']?.['memory'] ?? new WebAssembly.Memory({ initial: 10 }),
          table:
            go.importObject['env']?.['table'] ??
            new WebAssembly.Table({
              initial: 0,
              element: 'anyfunc',
            }),
        },
      });

      void go.run(module.instance);
    } catch {
      /* empty */
    }
  }
}
