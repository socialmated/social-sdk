import playwrightPlugin from 'eslint-plugin-playwright';
import playwrightTestRules from './rules/playwright-test.mjs';
import { TEST_FILES } from './constants.mjs';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: TEST_FILES,
    ...playwrightPlugin.configs['flat/recommended'],
  },
  {
    files: TEST_FILES,
    ...playwrightTestRules,
  },
];
