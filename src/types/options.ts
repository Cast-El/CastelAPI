export type Options = {
  retry?: number;
  responseType?: ResponseType;
  headers?: Partial<Headers> | Record<string, string> | null | undefined;
  body?: Record<string, any>;
  method?: string;
  parameters?: Map<string, any>;
  cache?: { enabled: boolean; cacheTime: number };
};

export type PostOptions = Options & {
  body?: Record<string, any>;
};
