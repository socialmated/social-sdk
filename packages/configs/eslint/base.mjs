import path from 'node:path';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import turboConfig from 'eslint-config-turbo/flat';
import { includeIgnoreFile } from '@eslint/compat';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import { ECMA_VERSION, JAVASCRIPT_FILES_CJS, JAVASCRIPT_FILES_ESM } from './constants.mjs';
import bestPracticeRules from './rules/best-practice.mjs';
import commentsRules from './rules/comments.mjs';
import es6Rules from './rules/es6.mjs';
import importsRules from './rules/import.mjs';
import possibleErrorsRules from './rules/possible-errors.mjs';
import stylisticRules from './rules/stylistic.mjs';
import unicornRules from './rules/unicorn.mjs';
import variablesRules from './rules/variables.mjs';
import 'eslint-plugin-only-warn';

const gitignorePath = path.join(process.cwd(), '.gitignore');

/**
 * This is the base for both our browser and Node ESLint config files.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  {
    ignores: ['!**/.*.js'],
  },
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  ...turboConfig,
  sonarjsPlugin.configs.recommended,
  prettierConfig,
  bestPracticeRules,
  commentsRules,
  es6Rules,
  importsRules,
  possibleErrorsRules,
  stylisticRules,
  unicornRules,
  variablesRules,
  {
    // Tell ESLint not to ignore dot-files, which are ignored by default.
    languageOptions: {
      ecmaVersion: ECMA_VERSION,
      globals: {
        ...globals[`es${ECMA_VERSION}`],
      },
      // Global parser options.
      parserOptions: {
        ecmaVersion: ECMA_VERSION,
        sourceType: 'module',
      },
    },
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/__snapshots__/**',
      '**/__generated__/**',
      '**/__fixtures__/**',
      '**/vendor/**',
      '**/static/**',
      'pnpm-lock.yaml',
    ],
    linterOptions: {
      // Report unused `eslint-disable` comments.
      reportUnusedDisableDirectives: true,
    },
    // Global settings used by all overrides.
    settings: {
      // Use the Node resolver by default.
      'import/resolver': {
        node: {},
      },
      'import/parsers': {
        espree: ['.js', '.cjs', '.mjs', '.jsx'],
      },
    },
  },
  {
    files: JAVASCRIPT_FILES_ESM,
    languageOptions: {
      ecmaVersion: ECMA_VERSION,
      parser: babelParser,
      sourceType: 'module',
      parserOptions: {
        requireConfigFile: false,
      },
    },
  },
  {
    files: JAVASCRIPT_FILES_CJS,
    languageOptions: {
      parser: babelParser,
      sourceType: 'commonjs',
      parserOptions: {
        requireConfigFile: false,
      },
    },
  },
  {
    languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
];
