import { createCookieHttpClient, type HttpClient } from '@social-sdk/core/client';
import { type Options } from 'got';
import { defaultConfig } from './config.js';
import { type RednoteCookieSession } from '@/auth/session.js';
import { XSCommonGenerator } from '@/security/fingerprint/generator.js';
import { XhsSigner } from '@/security/sign/signer.js';

export function createRednoteHttpClient(url: string | URL, session: RednoteCookieSession): HttpClient {
  const cookie = createCookieHttpClient(url, session);
  const signer = XhsSigner.fromSession(session);
  const fingerprint = new XSCommonGenerator(session);

  const signRequest = async (options: Options): Promise<void> => {
    const sig = await signer.sign(options);
    options.headers['X-s'] = sig['X-s'];
    options.headers['X-t'] = sig['X-t'];
    options.headers['X-Mns'] = sig['X-Mns'];
  };

  const addFingerprint = (options: Options): void => {
    const xsCommon = fingerprint.generate(defaultConfig, options);
    if (xsCommon) {
      options.headers['X-S-Common'] = xsCommon;
    }
  };

  return cookie.extend({
    hooks: {
      beforeRequest: [signRequest, addFingerprint, console.debug],
      afterResponse: [
        (response) => {
          console.debug(response);
          return response;
        },
      ],
    },
  });
}
