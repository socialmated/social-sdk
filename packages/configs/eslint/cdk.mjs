import cdkPlugin from 'eslint-plugin-cdk';
import { fixupPluginRules } from '@eslint/compat';
import cdkRules from './rules/cdk.mjs';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    plugins: {
      cdk: fixupPluginRules(cdkPlugin),
    },
  },
  cdkRules,
];
