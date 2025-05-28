import base from './base.mjs';

base.plugins.push('prettier-plugin-tailwindcss');

/** @type {import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  tailwindFunctions: ['clsx'],
};
