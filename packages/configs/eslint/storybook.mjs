import storybookPlugin from 'eslint-plugin-storybook';

/** @type {import("eslint").Linter.Config[]} */
export default [...storybookPlugin.configs['flat/recommended']];
