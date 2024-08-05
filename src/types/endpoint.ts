export type Endpoint <T extends string> =  T extends `/${string}` ? T : never;
