/**
 * These are enabled by `import/recommended`, but are better handled by
 * TypeScript and @typescript-eslint.
 */
const disabledRules = {
  'import/default': 'off',
  'import/export': 'off',
  'import/namespace': 'off',
  'import/no-unresolved': 'off',
};

/** @type {import("eslint").Linter.Config} */
export default {
  rules: {
    ...disabledRules,
    '@typescript-eslint/no-require-imports': [
      'error',
      {
        // allow imports of assets regex
        allow: ['\\.(svg|ttf|png|jpg|jpeg|gif|webp|avif|eot|woff|woff2|otf)$'],
      },
    ],
  },
};
