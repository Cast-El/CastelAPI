import { ResponseWrapper } from './responseWrapper'

export type CachedValue<T> = ResponseWrapper<T> & {
  timeStamp: number
}
