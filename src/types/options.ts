export type Options = {
  retry?: number
  headers?: Record<string, string> | undefined | null
  method?: string
  parameters?: Map<string, any>
  cache?: { enabled: boolean; cacheTime: number }
}

export type PostOptions = Options & {
  body?: Record<string, any>
}
