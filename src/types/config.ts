export type Config = {
  baseUrl: string;
  headers: { [key: string]: string };
  timeout: number;
  responseInterceptor?: <T>(response: T) => Partial<T>;
};
