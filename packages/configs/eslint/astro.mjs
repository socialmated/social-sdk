import { configs as astroConfigs } from 'eslint-plugin-astro';

/** @type {import("eslint").Linter.Config[]} */
export default [...astroConfigs['flat/jsx-a11y-recommended']];
