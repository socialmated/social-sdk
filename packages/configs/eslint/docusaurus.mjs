import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import docusaurusPlugin from '@docusaurus/eslint-plugin';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules } from '@eslint/compat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

/** @type {import("eslint").Linter.Config[]} */
export default [...fixupConfigRules(compat.config(docusaurusPlugin.configs.recommended))];
