import typescript from '@social-sdk/configs/eslint/typescript.mjs';
import node from '@social-sdk/configs/eslint/node.mjs';

/** @type {import("eslint").Linter.Config[]} */
export default [...node, ...typescript];
