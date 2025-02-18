export interface APIResponse<T = any> {
  status: boolean;
  data: T;
  message: string;
}
