// types/api-response.ts

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
