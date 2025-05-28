import detoxPlugin from 'eslint-plugin-detox';
import { fixupPluginRules } from '@eslint/compat';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    plugins: {
      detox: fixupPluginRules(detoxPlugin),
    },
  },
];
