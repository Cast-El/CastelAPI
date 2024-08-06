import { ResponseWrapper } from "./responseWrapper";

export type Config = {
  baseUrl: string;
  headers: { [key: string]: string };
  timeout: number;
  responseInterceptor?: <T>(data: ResponseWrapper<T>) => ResponseWrapper<T>;
};
