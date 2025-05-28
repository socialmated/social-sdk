import vitestPlugin from 'eslint-plugin-vitest';
import vitestRules from './rules/vitest.mjs';
import { TEST_FILES } from './constants.mjs';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: TEST_FILES,
    ...vitestPlugin.configs.recommended,
  },
  {
    files: TEST_FILES,
    ...vitestRules,
  },
];
