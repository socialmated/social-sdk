import sveltePlugin from 'eslint-plugin-svelte';

/** @type {import("eslint").Linter.Config[]} */
export default [...sveltePlugin.configs['flat/recommended'], ...sveltePlugin.configs['flat/prettier']];
