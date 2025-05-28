/** @type {import("prettier-plugin-embed").PluginEmbedOptions} */
const embedOptions = {};

/** @type {import("prettier-plugin-sh").ShOptions} */
const shOptions = {};

/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-packagejson'],
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 120,
  bracketSpacing: true,
  jsxSingleQuote: true,
  ...embedOptions,
  ...shOptions,
};
