import { readFileSync } from 'node:fs';
import path from 'node:path';
import { UIMetricsMeasurer } from './measure.js';
import { UIMetricsJsParser } from './parser.js';

describe('ui-metrics', () => {
  const jsInstFile = readFileSync(path.join(import.meta.dirname, '__fixtures__', 'js_inst.js'), 'utf-8');

  describe('evaluate', () => {
    it('should evaluate the ui metrics correctly', async () => {
      vi.spyOn(UIMetricsJsParser, 'create').mockResolvedValue(new UIMetricsJsParser(jsInstFile));

      const measurer = new UIMetricsMeasurer();
      const result = await measurer.measure();

      expect(result).toMatchSnapshot();
    });
  });
});
