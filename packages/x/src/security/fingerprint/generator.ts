import 'golang-wasm-exec';
import { HeaderGenerator } from 'header-generator';
import { loadWasmModule } from './wasm.js';
import { type XCookieSession } from '@/auth/session.js';

declare global {
  // eslint-disable-next-line no-var -- global variable declaration
  var getForwardedForStr: (() => Promise<{ str: string; expiryTimeMillis: string }>) | undefined;
}

export class XPFwdForGenerator {
  constructor(session: XCookieSession) {
    Object.assign(globalThis.navigator, {
      userActivation: {
        hasBeenActive: false,
      },
    });
    Object.defineProperty(globalThis.navigator, 'userAgent', {
      get: () => new HeaderGenerator().getHeaders()['user-agent'],
      configurable: true,
    });
    Object.defineProperty(globalThis, 'document', {
      value: {
        cookie: session.cookieJar.getCookieStringSync(session.issuer.toString()),
      },
    });
  }

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
