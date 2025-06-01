import { readFileSync } from 'node:fs';
import path from 'node:path';
import { UIMetricsMeasurer } from './measure.js';
import { UIMetricsJsParser } from './parser.js';

describe(UIMetricsMeasurer, () => {
  const jsInstFile = readFileSync(path.join(import.meta.dirname, '__fixtures__', 'js_inst.js'), 'utf-8');

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
