import { getPlatformCode } from './platform.js';
import { b64Encode, encodeUtf8, encryptMcr } from './encrypt.js';

/**
 * Default version for the xsCommon fingerprinting function.
 */
const DEFAULT_XS_COMMON_VERSION = '4.1.0';

/**
 * Generates a base64-encoded fingerprint string based on provided platform and security parameters.
 *
 * @param platform - The platform identifier (e.g., 'PC', 'iOS', 'Android').
 * @param a1 - The `a1` cookie value, which is a unique identifier for the user session.
 * @param b1 - The browser fingerprint value.
 * @param b1b1 - An optional additional fingerprint value. Defaults to '1'.
 * @param sc - An optional signature count. Defaults to 0.
 * @param xt - An optional `X-t` header value from the request.
 * @param xs - An optional `X-s` header value from the request.
 * @returns A base64-encoded string representing the fingerprint.
 */
function xsCommon(platform: string, a1: string, b1: string, b1b1 = '1', sc = 0, xt = '', xs = ''): string {
  const fingerprint = {
    s0: getPlatformCode(platform),
    s1: '',
    x0: b1b1,
    x1: DEFAULT_XS_COMMON_VERSION,
    x2: platform || 'PC',
    x3: 'xhs-pc-web',
    x4: '4.67.0',
    x5: a1,
    x6: xt,
    x7: xs,
    x8: b1,
    x9: encryptMcr(''.concat(xt).concat(xs).concat(b1)),
    x10: sc,
    x11: 'normal',
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

export { xsCommon, getB1 };
