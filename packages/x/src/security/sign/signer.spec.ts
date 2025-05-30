import { readFileSync } from 'node:fs';
import path from 'node:path';
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
      const transactionId = await signer.sign('POST', '/i/api/1.1/some-endpoint.json');

      expect(transactionId).toMatchSnapshot();
    });
  });
});
