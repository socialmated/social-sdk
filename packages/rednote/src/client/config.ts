const defaultConfig = {
  appId: 'xhs-pc-web',
  callFrom: 'web',
  carryDeviceInfo: false,
  includes: ['xiaohongshu.com'],
  process461Response: true,
  captchaInCurrent: false,
  isHidden: 'visible',
  platform: 'Mac OS',
  forceLoginHook: undefined,
  xsIgnore: [],
  configInit: false,
  autoReload: false,
  disableMns: false,
  spamCallback: undefined,
  onCaptchaClose: undefined,
  onReadyToLoadJS: undefined,
  loadTimeout: 4000,
};

type ClientConfig = typeof defaultConfig;

/**
 * Default patterns for common API endpoints that should trigger fingerprint generation.
 * These patterns are used to match against request URLs to determine if fingerprinting is necessary.
 */
const defaultCommonPatterns = [
  'fe_api/burdock/v2/user/keyInfo',
  'fe_api/burdock/v2/shield/profile',
  'fe_api/burdock/v2/shield/captcha',
  'fe_api/burdock/v2/shield/registerCanvas',
  'api/sec/v1/shield/webprofile',
  'api/sec/v1/shield/captcha',
  /fe_api\/burdock\/v2\/note\/[0-9a-zA-Z]+\/tags/,
  /fe_api\/burdock\/v2\/note\/[0-9a-zA-Z]+\/image_stickers/,
  /fe_api\/burdock\/v2\/note\/[0-9a-zA-Z]+\/other\/notes/,
  /fe_api\/burdock\/v2\/note\/[0-9a-zA-Z]+\/related/,
  '/fe_api/burdock/v2/note/post',
  '/api/sns/web',
  '/api/redcaptcha',
  '/api/store/jpd/main',
];

export { defaultConfig, defaultCommonPatterns };
export type { ClientConfig };
