import { UIMetricsMeasurer } from './measure.js';
import { UIMetricsJsParser } from './parser.js';
import jsInstFile from './__fixtures__/js_inst.js.js';

describe(UIMetricsMeasurer, () => {
  let measurer: UIMetricsMeasurer;

  beforeEach(() => {
    vi.spyOn(UIMetricsJsParser, 'create').mockResolvedValue(new UIMetricsJsParser(jsInstFile));

    measurer = new UIMetricsMeasurer();
  });

  describe(UIMetricsMeasurer.prototype.measure, () => {
    it('should measure the ui metrics', async () => {
      const result = await measurer.measure();

      expect(result).toMatchSnapshot();
    });
  });
});
