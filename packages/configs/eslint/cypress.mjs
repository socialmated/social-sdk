import cypressPlugin from 'eslint-plugin-cypress/flat';
import { TEST_FILES } from './constants.mjs';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: TEST_FILES,
    ...cypressPlugin.configs.recommended,
  },
];
