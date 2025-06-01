import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Options } from 'got';
import { TransactionIdSigner } from './signer.js';
import { HomeHtmlParser, OnDemandJsParser } from './parser.js';

describe('TransactionIdSigner', () => {
  const homeHtml = readFileSync(path.join(import.meta.dirname, '__fixtures__', 'home.html'), 'utf-8');
  const onDemandFile = readFileSync(path.join(import.meta.dirname, '__fixtures__', 'ondemand.s.57b4929a.js'), 'utf-8');

  let signer: TransactionIdSigner;

  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    vi.setSystemTime(Date.UTC(2025, 0, 1));

    vi.spyOn(HomeHtmlParser, 'create').mockResolvedValue(new HomeHtmlParser(homeHtml));
    vi.spyOn(OnDemandJsParser, 'create').mockResolvedValue(new OnDemandJsParser(onDemandFile));

    signer = new TransactionIdSigner();
  });

  describe('sign', () => {
    it('should sign request and return transaction ID', async () => {
      const req = new Options({
        method: 'POST',
        url: 'https://x.com/i/api/1.1/endpoint.json',
      });
      const transactionId = await signer.sign(req);

      expect(transactionId).toMatchSnapshot();
    });
  });
});
