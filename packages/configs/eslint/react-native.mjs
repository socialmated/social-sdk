import path from 'node:path';
import { fileURLToPath } from 'node:url';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import reactNativePlugin from 'eslint-plugin-react-native';
import reactNativeA11yPlugin from 'eslint-plugin-react-native-a11y';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import { fixupConfigRules } from '@eslint/compat';
import reactRules from './rules/react.mjs';
import reactNativeRules from './rules/react-native.mjs';

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
  ...fixupConfigRules(compat.config(reactNativePlugin.configs.all)),
  ...fixupConfigRules(compat.config(reactNativeA11yPlugin.configs.basic)),
  ...fixupConfigRules(compat.config(importPlugin.configs['react-native'])),
  prettierConfig,
  reactRules,
  reactNativeRules,
  {
    plugins: {
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      'react-refresh/only-export-components': 'warn',
    },
  },
  {
    languageOptions: {
      globals: {
        'react-native/react-native': true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
