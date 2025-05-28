/** @type {import("eslint").Linter.Config} */
export default {
  rules: {
    /**
     * Require lowercase test names.
     *
     * 🔧 Fixable - https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-lowercase-title.md
     */
    'playwright/prefer-lowercase-title': 'warn',
    /**
     * Require using `toHaveLength` over explicitly checking lengths.
     *
     * 🔧 Fixable - https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-lowercase-title.md
     */
    'playwright/prefer-to-have-length': 'warn',
  },
};
