interface ApiSuccessResponse<T> {
  data: T;
  code: number;
  success: true;
  msg: string;
}

interface ApiErrorResponse {
  code: number;
  success: false;
  data: null;
  msg: string;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

const isApiResponse = <T>(body: unknown): body is ApiResponse<T> => {
  if (typeof body !== 'object' || body === null) {
    return false;
  }
  const response = body as ApiResponse<T>;
  return (
    typeof response.code === 'number' &&
    typeof response.success === 'boolean' &&
    typeof response.data === 'object' &&
    typeof response.msg === 'string'
  );
};

interface Result {
  message: string;
  success: boolean;
  code: number;
}

export { isApiResponse };
export type { ApiResponse, ApiSuccessResponse, ApiErrorResponse, Result };
