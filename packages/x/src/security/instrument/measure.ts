import { JSDOM } from 'jsdom';
import { type ParsedFunction, UIMetricsJsParser } from './parser.js';

/**
 * Measures UI metrics by evaluating a specific function in a simulated browser environment.
 *
 * @example
 * ```typescript
 * const measurer = new UIMetricsMeasurer();
 * const metrics = await measurer.measure();
 * console.log(metrics.rf, metrics.s);
 * ```
 */
export class UIMetricsMeasurer {
  /**
   * The JSDOM instance used to simulate a browser environment for UI metrics measurement.
   */
  private dom: JSDOM;

  /**
   * The parsed UI metrics function extracted from the JavaScript file.
   */
  private uiMetricsFunction?: ParsedFunction;

  /**
   * Initializes the class with a JSDOM environment simulating a browser.
   */
  constructor() {
    this.dom = new JSDOM(`<body></body>`, {
      url: 'https://twitter.com',
      runScripts: 'dangerously',
      pretendToBeVisual: true,
    });
  }

  /**
   * Measures UI metrics by evaluating the parsed function in the JSDOM environment.
   *
   * @returns A promise that resolves to an object containing the UI metrics results.
   */
  public async measure(): Promise<{
    rf: Record<string, number>;
    s: string;
  }> {
    if (!this.uiMetricsFunction) {
      await this.init();
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- expected to be defined after init
    const uiMetricsFunction = this.uiMetricsFunction!;

    // Evaluate the function in the JSDOM environment
    this.dom.window.eval(uiMetricsFunction.source);
    const result = this.dom.window.eval(`${uiMetricsFunction.node.id.name}()`);

    return result as {
      rf: Record<string, number>;
      s: string;
    };
  }

  /**
   * Initializes the UI metrics parser and extracts the target function.
   *
   * @returns A promise that resolves when initialization is complete.
   * @throws If the target function cannot be found in the UI metrics JavaScript file.
   */
  private async init(): Promise<void> {
    const parser = await UIMetricsJsParser.create();

    // Get the target function from the UI metrics JavaScript file
    const targetFunction = parser.parseTargetFunction();
    if (!targetFunction) {
      throw new Error('Target function not found in UI metrics JavaScript file');
    }
    this.uiMetricsFunction = targetFunction;
  }
}
