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

/**
 * The API endpoints of Rednote (Xiaohongshu).
 */
enum RednoteAPIEndpoints {
  /**
   * The base URL for Rednote's security API endpoints.
   */
  SecV1 = 'https://as.xiaohongshu.com/api/sec/v1/',

  /**
   * The base URL for Rednote's SNS Web V1 API endpoints.
   */
  SnsWebV1 = 'https://edith.xiaohongshu.com/api/sns/web/v1/',

  /**
   * The base URL for Rednote's SNS Web V2 API endpoints.
   */
  SnsWebV2 = 'https://edith.xiaohongshu.com/api/sns/web/v2/',

  /**
   * The base URL for Rednote's IM API endpoints.
   */
  IM = 'https://edith.xiaohongshu.com/api/im/',

  /**
   * The base URL for Rednote's Report API endpoints.
   */
  Report = 'https://edith.xiaohongshu.com/api/report/',
}

export { defaultConfig, defaultCommonPatterns, RednoteAPIEndpoints };
export type { ClientConfig };
