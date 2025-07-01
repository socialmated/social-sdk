import { Options } from 'got';
import { AppSecretProofSigner } from './signer.js';

describe(AppSecretProofSigner, () => {
  const appSecret = 'test_app_secret_12345';
  const accessToken = 'test_access_token_abcdef';

  let signer: AppSecretProofSigner;

  beforeEach(() => {
    vi.setSystemTime(new Date(2025, 0, 1));
    signer = new AppSecretProofSigner(appSecret);
  });

  describe(AppSecretProofSigner.prototype.sign, () => {
    it('should sign request with access token in URL and return app secret proof', () => {
      const req = new Options({
        method: 'GET',
        url: `https://graph.facebook.com/v12.0/me?access_token=${accessToken}`,
      });
      const proof = signer.sign(req);

      expect(proof).toMatchSnapshot();
    });

    it('should sign request with access token in searchParams string and return app secret proof', () => {
      const req = new Options({
        method: 'GET',
        url: 'https://graph.facebook.com/v12.0/me',
        searchParams: `access_token=${accessToken}&fields=id,name`,
      });
      const proof = signer.sign(req);

      expect(proof).toMatchSnapshot();
    });

    it('should sign request with access token in searchParams URLSearchParams and return app secret proof', () => {
      const searchParams = new URLSearchParams();
      searchParams.set('access_token', accessToken);
      searchParams.set('fields', 'id,name');

      const req = new Options({
        method: 'GET',
        url: 'https://graph.facebook.com/v12.0/me',
        searchParams,
      });
      const proof = signer.sign(req);

      expect(proof).toMatchSnapshot();
    });

    it('should sign request with access token in searchParams object and return app secret proof', () => {
      const req = new Options({
        method: 'POST',
        url: 'https://graph.facebook.com/v12.0/me/photos',
        searchParams: {
          access_token: accessToken,
          message: 'Test photo upload',
        },
      });
      const proof = signer.sign(req);

      expect(proof).toMatchSnapshot();
    });

    it('should prioritize access token from URL over searchParams when both are present', () => {
      const urlAccessToken = 'url_access_token_123';
      const req = new Options({
        method: 'GET',
        url: `https://graph.facebook.com/v12.0/me?access_token=${urlAccessToken}`,
        searchParams: {
          access_token: accessToken,
        },
      });
      const proof = signer.sign(req);

      expect(proof).toMatchSnapshot();
    });

    it('should throw error when access token is not provided', () => {
      const req = new Options({
        method: 'GET',
        url: 'https://graph.facebook.com/v12.0/me',
      });

      expect(() => signer.sign(req)).toThrow('Access token is required to generate App Secret Proof');
    });

    it('should throw error when access token is null in searchParams object', () => {
      const req = new Options({
        method: 'GET',
        url: 'https://graph.facebook.com/v12.0/me',
        searchParams: {
          access_token: null,
          fields: 'id,name',
        },
      });

      expect(() => signer.sign(req)).toThrow('Access token is required to generate App Secret Proof');
    });
  });
});
