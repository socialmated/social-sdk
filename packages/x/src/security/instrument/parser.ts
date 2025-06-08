import { gotScraping } from '@social-sdk/client/http';
import { type AnonymousFunctionDeclaration, type FunctionDeclaration, Parser, type ReturnStatement } from 'acorn';
import { simple } from 'acorn-walk';

/**
 * Represents a parsed function containing the source code and its AST node.
 */
export interface ParsedFunction {
  source: string;
  node: FunctionDeclaration;
}

/**
 * Parses the UI metrics JavaScript file to extract the target function that computes UI metrics.
 */
export class UIMetricsJsParser {
  /**
   * The target function that contains the UI metrics logic.
   */
  private targetFunction: FunctionDeclaration | null = null;

  /**
   * Constructs a new instance of the parser and parses the provided script text.
   *
   * @param sourceCode - The JavaScript source code to be parsed.
   */
  constructor(private sourceCode: string) {}

  /**
   * Creates a UIMetricsJsParser by fetching and parsing the UI metrics JavaScript.
   *
   * @returns A promise that resolves to an instance of UIMetricsJsParser.
   */
  public static async create(): Promise<UIMetricsJsParser> {
    const jsFileContent = await gotScraping('https://twitter.com/i/js_inst?c_name=ui_metrics', {
      headers: {
        accept: '*/*',
        referer: 'https://x.com/',
        'sec-fetch-dest': 'script',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'cross-site',
      },
    }).text();

    return new UIMetricsJsParser(jsFileContent);
  }

  /**
   * Parses the source code to locate and extract the target function's source as a string.
   *
   * @returns The source code of the target function if found, or null if not found.
   */
  public parseTargetFunction(): ParsedFunction | null {
    const ast = Parser.parse(this.sourceCode, {
      ecmaVersion: 2020,
      sourceType: 'script',
      allowReturnOutsideFunction: true,
    });

    // Walk the AST to find the target function
    simple(ast, {
      FunctionDeclaration: (node) => {
        this.checkFunction(node);
      },
    });

    if (!this.targetFunction) {
      return null;
    }

    return {
      source: this.sourceCode.slice(this.targetFunction.start, this.targetFunction.end),
      node: this.targetFunction,
    };
  }

  /**
   * Checks whether the given function node contains a direct return statement
   * that returns an object with 'rf' and 's' properties.
   *
   * @param node - The function declaration node to check.
   */
  private checkFunction(node: FunctionDeclaration | AnonymousFunctionDeclaration): void {
    // Look for function that has a return statement with an object containing 'rf' and 's' properties
    let hasTargetReturn = false;
    for (const stmt of node.body.body) {
      if (stmt.type === 'ReturnStatement' && this.isTargetReturnStatement(stmt)) {
        hasTargetReturn = true;
        break;
      }
    }

    if (hasTargetReturn) {
      this.targetFunction = node as FunctionDeclaration;
    }
  }

  /**
   * Determines whether a given return statement node returns an object expression
   * containing both 'rf' and 's' properties.
   *
   * @param returnNode - The AST node representing a return statement.
   * @returns `true` if the return statement returns an object with both 'rf' and 's' properties; otherwise, `false`.
   */
  private isTargetReturnStatement(returnNode: ReturnStatement): boolean {
    const returnArg = returnNode.argument;

    // Check if return statement returns an object expression
    if (!returnArg || returnArg.type !== 'ObjectExpression') {
      return false;
    }

    const properties = returnArg.properties;

    // Look for 'rf' and 's' properties
    const hasRfProperty = properties.some(
      (prop) => prop.type === 'Property' && prop.key.type === 'Literal' && prop.key.value === 'rf',
    );
    const hasSProperty = properties.some(
      (prop) => prop.type === 'Property' && prop.key.type === 'Literal' && prop.key.value === 's',
    );

    return hasRfProperty && hasSProperty;
  }
}
