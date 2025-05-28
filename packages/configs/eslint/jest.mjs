import jestPlugin from 'eslint-plugin-jest';
import jestExtendedPlugin from 'eslint-plugin-jest-extended';
import { TEST_FILES, TYPESCRIPT_FILES_ESM } from './constants.mjs';
import jestRules from './rules/jest.mjs';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: TEST_FILES,
    ...jestPlugin.configs['flat/recommended'],
  },
  {
    files: TEST_FILES,
    ...jestRules,
  },
  {
    files: TEST_FILES,
    ...jestExtendedPlugin.configs['flat/recommended'],
  },
  // Prefer the Jest version of this rule. This silently fails when type
  // information is not available.
  {
    files: TYPESCRIPT_FILES_ESM,
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      'jest/unbound-method': 'error',
    },
  },
];
