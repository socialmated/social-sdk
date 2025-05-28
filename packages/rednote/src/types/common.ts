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

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
