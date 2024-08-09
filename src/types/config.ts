import { ResponseWrapper } from "./responseWrapper";

export type Config = {
  baseUrl: string;
  headers: { [key: string]: string };
  responseInterceptor?: <T>(data: ResponseWrapper<T>) => ResponseWrapper<T>;
};
