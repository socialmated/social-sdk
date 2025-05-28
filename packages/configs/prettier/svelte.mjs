import base from './base.mjs';

base.plugins.push('prettier-plugin-svelte');

/** @type {import("prettier").Config} */
export default {
  ...base,
  overrides: [
    {
      files: '*.svelte',
      options: { parser: 'svelte' },
    },
  ],
};
