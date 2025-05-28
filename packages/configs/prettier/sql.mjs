import base from './base.mjs';

base.plugins.push('prettier-plugin-sql');

/** @type {import('prettier-plugin-sql').SqlBaseOptions} */
export default {
  language: 'postgresql',
  keywordCase: 'upper',
};
