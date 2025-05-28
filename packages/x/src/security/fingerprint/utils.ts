import { readFileSync } from 'node:fs';
import path from 'node:path';

export async function loadWasmModule(
  importObject: WebAssembly.Imports = {
    global: {},
    env: {
      memory: new WebAssembly.Memory({
        initial: 10,
        maximum: 100,
      }),
      table: new WebAssembly.Table({
        initial: 0,
        element: 'anyfunc',
      }),
    },
  },
): Promise<WebAssembly.WebAssemblyInstantiatedSource> {
  const wasmPath = path.join(import.meta.dirname, 'wasm', 'fwd_for.wasm');
  const wasmBuffer = readFileSync(wasmPath);
  return WebAssembly.instantiate(wasmBuffer, importObject);
}
