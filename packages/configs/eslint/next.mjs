import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nextPlugin from '@next/eslint-plugin-next';
import babelParser from '@babel/eslint-parser';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { JAVASCRIPT_FILES_ESM } from './constants.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const babelOptions = {
  presets: (() => {
    try {
      import.meta.resolve('next/babel');
      return ['next/babel'];
    } catch {
      return [];
    }
  })(),
};

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    plugins: {
      '@next/next': fixupPluginRules(nextPlugin),
    },
  },
  ...fixupConfigRules(compat.config(nextPlugin.configs.recommended)),
  {
    files: JAVASCRIPT_FILES_ESM,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: babelParser,
      parserOptions: { babelOptions },
    },
  },
];
