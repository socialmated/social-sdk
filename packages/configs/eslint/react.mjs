import path from 'node:path';
import { fileURLToPath } from 'node:url';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import { fixupConfigRules } from '@eslint/compat';
import jsxA11yRules from './rules/jsx-a11y.mjs';
import reactRules from './rules/react.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

/** @type {import("eslint").Linter.Config[]} */
export default [
  reactPlugin.configs.flat.recommended,
  ...fixupConfigRules(compat.config(reactHooksPlugin.configs.recommended)),
  jsxA11yPlugin.flatConfigs.recommended,
  ...fixupConfigRules(compat.config(importPlugin.configs.react)),
  prettierConfig,
  reactRules,
  jsxA11yRules,
  {
    plugins: {
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      'react-refresh/only-export-components': 'warn',
    },
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
