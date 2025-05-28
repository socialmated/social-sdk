import expoPlugin from 'eslint-plugin-expo';
import { fixupPluginRules } from '@eslint/compat';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    plugins: {
      expo: fixupPluginRules(expoPlugin),
    },
  },
  {
    rules: {
      'expo/no-dynamic-env-var': 'error',
    },
  },
];
