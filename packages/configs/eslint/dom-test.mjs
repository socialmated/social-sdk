import testingLibraryPlugin from 'eslint-plugin-testing-library';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import { fixupConfigRules } from '@eslint/compat';
import { TEST_FILES } from './constants.mjs';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...fixupConfigRules({
    files: TEST_FILES,
    ignores: ['**/e2e/**'],
    ...testingLibraryPlugin.configs['flat/dom'],
  }),
  {
    files: TEST_FILES,
    ignores: ['**/e2e/**'],
    ...jestDomPlugin.configs['flat/recommended'],
  },
];
