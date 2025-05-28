import tsdoc from 'eslint-plugin-tsdoc';

/** @type {import("eslint").Linter.Plugin} */
const tsdocPlugin = tsdoc;

/** @type {import("eslint").Linter.Config} */
export default {
  plugins: {
    tsdoc: tsdocPlugin,
  },
  rules: {
    /**
     * Require TSDoc comments conform to the TSDoc specification.
     *
     * 🚫 Not fixable - https://github.com/microsoft/tsdoc/tree/master/eslint-plugin
     */
    'tsdoc/syntax': 'error',
  },
};
