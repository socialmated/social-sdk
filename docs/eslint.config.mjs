import react from '@social-sdk/configs/eslint/react.mjs';
import next from '@social-sdk/configs/eslint/next.mjs';
import browser from '@social-sdk/configs/eslint/browser.mjs';
import typescript from '@social-sdk/configs/eslint/typescript.mjs';
import playwright from '@social-sdk/configs/eslint/playwright.mjs';
import vitest from '@social-sdk/configs/eslint/vitest.mjs';
import reactTest from '@social-sdk/configs/eslint/react-test.mjs';

/** @type {import("eslint").Linter.Config[]} */
export default [...browser, ...typescript, ...vitest, ...react, ...reactTest, ...playwright, ...next];
