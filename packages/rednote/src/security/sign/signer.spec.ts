import { Options } from 'got';
import { XhsSigner } from './signer.js';
import { RednoteCookieSession } from '@/auth/session.js';

describe('XhsSigner', () => {
  const a1 = '1972697fa3d2ly0o5nfy1iqg0ra0w56q79gz2gm0450000417121';

  let session: RednoteCookieSession;
  let signer: XhsSigner;

  beforeEach(() => {
    vi.setSystemTime(new Date(2025, 0, 1));

    session = new RednoteCookieSession();
    session.set('a1', a1);
    signer = new XhsSigner(session);
  });

  describe('sign', () => {
    it('should sign POST request with body and return signature', () => {
      const req = new Options({
        method: 'POST',
        url: 'https://edith.xiaohongshu.com/api/sns/web/v1/resource',
        json: {
          key: 'value',
          type: 'example',
        },
      });
      const sig = signer.sign(req);

      expect(sig).toMatchSnapshot();
    });

    it('should sign GET request with query parameters and return signature', () => {
      const req = new Options({
        method: 'GET',
        url: 'https://edith.xiaohongshu.com/api/sns/web/v1/resource',
        searchParams: {
          key: 'value',
          type: 'example',
        },
      });
      const sig = signer.sign(req);

      expect(sig).toMatchSnapshot();
    });
  });
});
