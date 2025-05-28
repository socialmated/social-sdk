import base from './base.mjs';

base.plugins.push('prettier-plugin-astro');

/** @type {import("prettier").Config} */
export default {
  ...base,
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
