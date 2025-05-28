import { XPFwdForGenerator } from './generator.js';
import { XCookieSession } from '@/auth/session.js';

describe('XPFwdForGenerator', () => {
  describe('generate', () => {
    it('should generate a fingerprint', async () => {
      const session = new XCookieSession();
      const generator = new XPFwdForGenerator(session);
      const result = await generator.generate();

      expect(result).toHaveProperty('str');
      expect(result).toHaveProperty('expiryTimeMillis');

      expect(result.str).toMatch(/^[a-f0-9]+$/);
      expect(result.expiryTimeMillis).toMatch(/^\d+$/);
      expect(Number(result.expiryTimeMillis)).toBeGreaterThan(Date.now());
    });
  });
});
