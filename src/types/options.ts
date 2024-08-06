export type Options = {
  retry?: number;
  headers?: Partial<Headers> | Record<string, string> | null | undefined;
  method?: string;
  parameters?: Map<string, any>;
  cache?: { enabled: boolean; cacheTime: number };
};

export type PostOptions = Options & {
  body?: Record<string, any>;
};
