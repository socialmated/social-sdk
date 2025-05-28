import ts, { configs as tsConfigs } from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import typescriptRules from './rules/typescript.mjs';
import typescriptExtensionRules from './rules/typescript-extension.mjs';
import typescriptImportRules from './rules/typescript-import.mjs';
import tsDocRules from './rules/tsdoc.mjs';
import { TYPESCRIPT_FILES_ESM } from './constants.mjs';

/** @type {import("eslint").Linter.Config[]} */
export default ts.config({
  files: TYPESCRIPT_FILES_ESM,
  extends: [
    ...tsConfigs.recommendedTypeChecked,
    ...tsConfigs.strictTypeChecked,
    ...tsConfigs.stylisticTypeChecked,
    importPlugin.flatConfigs.typescript,
    prettierConfig,
    typescriptRules,
    typescriptExtensionRules,
    typescriptImportRules,
    tsDocRules,
  ],
  languageOptions: {
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      projectService: true,
    },
  },
});
