import { randomInt } from 'node:crypto';
import { getPlatformCode } from './platform.js';
import { b64Encode, encodeUtf8, encryptMcr } from './encrypt.js';

/**
 * Default version for the xsCommon fingerprinting function.
 */
const DEFAULT_XS_COMMON_VERSION = '4.1.0';

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
 * Generates a base64-encoded fingerprint string based on provided platform and security parameters.
 *
 * @param platform - The platform identifier (e.g., 'PC', 'iOS', 'Android').
 * @param xt - The `X-t` header value, which is a timestamp.
 * @param xs - The `X-s` header value, which is a request signature.
 * @param a1 - The `a1` cookie value, which is a unique identifier for the user session.
 * @param b1 - The browser fingerprint value.
 * @param sc - an optional signature count; if not provided, a random integer between 10 and 29 is used.
 * @param b1b1 - an optional additional fingerprint value; defaults to '1' if not provided.
 * @returns The base64-encoded fingerprint string.
 */
function xsCommon(
  platform: string,
  xt: string,
  xs: string,
  a1: string,
  b1: string,
  sc?: number,
  b1b1?: string,
): string {
  const fingerprint = {
    s0: getPlatformCode(platform),
    s1: '',
    x0: b1b1 ?? '1',
    x1: DEFAULT_XS_COMMON_VERSION,
    x2: platform || 'PC',
    x3: 'xhs-pc-web',
    x4: '4.62.3',
    x5: a1,
    x6: xt,
    x7: xs,
    x8: b1,
    x9: encryptMcr(''.concat(xt).concat(xs).concat(b1)),
    x10: sc ?? randomInt(10, 29),
  };

  return b64Encode(encodeUtf8(JSON.stringify(fingerprint)));
}

function getB1(ts = Date.now()): string {
  const browserEnv = {
    x33: '0',
    x34: '0',
    x35: '0',
    x36: '3',
    x37: '0|0|0|0|0|0|0|0|0|1|0|0|0|0|0|0|0|0|1|0|0|0|0|0',
    x38: '0|0|1|0|1|0|0|0|0|0|1|0|1|0|1|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0',
    x39: '0',
    x42: '3.3.3',
    x43: 'c12c562c',
    x44: ts.toString(),
    x45: 'connecterror',
    x46: 'false',
    x48: '',
    x49: '{list:[],type:}',
    x50: '',
    x51: '',
    x52: '[]',
  };
  return b64Encode(encodeUtf8(JSON.stringify(browserEnv)));
}

export { defaultCommonPatterns, xsCommon, getB1 };
