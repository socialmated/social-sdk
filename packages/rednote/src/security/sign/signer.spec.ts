import { XhsSigner } from './signer.js';

describe('XhsSigner', () => {
  const a1 = '1972697fa3d2ly0o5nfy1iqg0ra0w56q79gz2gm0450000417121';

  let signer: XhsSigner;

  beforeEach(() => {
    vi.setSystemTime(new Date(2025, 0, 1));

    signer = new XhsSigner(a1);
  });

  describe('sign', () => {
    it('should sign request and return signatures', async () => {
      const sig = await signer.sign('/api/sns/web/v1/some-endpoint', {
        key: 'value',
        type: 'example',
      });

      expect(sig).toMatchSnapshot();
    });
  });
});
