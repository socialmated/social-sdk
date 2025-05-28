import { type Options, type Response, type CancelableRequest } from 'got';

type Promisable<T> = T | Promise<T>;

function isResponse(value: unknown): value is Response {
  return typeof value === 'object' && value !== null && 'statusCode' in value;
}

// TODO: structured logging
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- match the original function signature
function debug(options: Options): Promisable<void | Response>;
function debug(response: Response): Promisable<Response | CancelableRequest<Response>>;
function debug(message: Options | Response): Promisable<void | Response | CancelableRequest<Response>> {
  console.debug(message);
  if (isResponse(message)) {
    return message;
  }
}

export { debug };
