import { Options } from 'got';
import { TransactionIdSigner } from './signer.js';
import { HomeHtmlParser, OnDemandJsParser } from './parser.js';
import homeHtml from './__fixtures__/home.html.js';
import onDemandFile from './__fixtures__/ondemand.s.57b4929a.js.js';

describe(TransactionIdSigner, () => {
  let signer: TransactionIdSigner;

  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    vi.setSystemTime(Date.UTC(2025, 0, 1));

    vi.spyOn(HomeHtmlParser, 'create').mockResolvedValue(new HomeHtmlParser(homeHtml));
    vi.spyOn(OnDemandJsParser, 'create').mockResolvedValue(new OnDemandJsParser(onDemandFile));

    signer = new TransactionIdSigner();
  });

  describe(TransactionIdSigner.prototype.sign, () => {
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
