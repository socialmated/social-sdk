import { type Options, type Response, type CancelableRequest } from 'got';

/**
 * Promisable type that can be either a value or a Promise of that value.
 */
type Promisable<T> = T | Promise<T>;

/**
 * Type guard to check if a value is a Response object.
 *
 * @param value - The value to check.
 * @returns True if the value is a Response object, false otherwise.
 */
function isResponse(value: unknown): value is Response {
  return typeof value === 'object' && value !== null && 'statusCode' in value;
}

/**
 * Debug utility for logging HTTP requests.
 *
 * @param options - The request options to log.
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- match the original function signature
function debug(options: Options): Promisable<void | Response>;
/**
 * Debug utility for logging HTTP responses.
 * @param response - The HTTP response to log.
 */
function debug(response: Response): Promisable<Response | CancelableRequest<Response>>;
function debug(message: Options | Response): Promisable<void | Response | CancelableRequest<Response>> {
  // Log the HTTP response
  if (isResponse(message)) {
    const logData = {
      level: 'debug',
      timestamp: new Date().toISOString(),
      type: 'http_response',
      http: {
        statusCode: message.statusCode,
        statusMessage: message.statusMessage,
        method: message.request.options.method,
        url: message.url || message.request.requestUrl,
        headers: message.headers,
        timings: message.timings,
        redirectUrls: message.redirectUrls,
        retryCount: message.retryCount,
      },
      body: message.body,
    };
    console.debug(JSON.stringify(logData, null, 2));
    return message;
  }
  // Log the HTTP request
  const logData = {
    level: 'debug',
    timestamp: new Date().toISOString(),
    type: 'http_request',
    http: {
      method: message.method,
      url: message.url?.toString(),
      headers: message.headers,
      timeout: message.timeout,
      retry: message.retry,
      followRedirect: message.followRedirect,
      maxRedirects: message.maxRedirects,
    },
    body: message.body,
  };
  console.debug(JSON.stringify(logData, null, 2));
}

export { debug };
