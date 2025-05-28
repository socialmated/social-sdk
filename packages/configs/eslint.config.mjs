import node from './eslint/node.mjs';
import typescript from './eslint/typescript.mjs';

/** @type {import("eslint").Linter.Config[]} */
export default [...node, ...typescript];
