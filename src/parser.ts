import { ResponseType } from "./types/responseType";
import { ResponseWrapper } from "./types/responseWrapper";

export const parseResponse = async <T>(
  response: Response
): Promise<ResponseWrapper<T>> => {
  if (!response.ok) {
    throw response;
  }
  return await parse<T>(response);
};

export const parse = async <T>(
  response: Response,
  responseType?: ResponseType
): Promise<ResponseWrapper<T>> => {
  const isBlob =
    response.headers?.get("Content-Type") === "application/pdf" ||
    responseType === "blob";
  const isError = response instanceof TypeError || !response;
  const hasNoCloneFunction = !response || typeof response.clone !== "function";

  if (isBlob || isError || hasNoCloneFunction) {
    // Returning with a fallback type of `T` in case of errors or unsupported content types
    return { data: undefined as unknown as T, url: response.url, status: response.status };
  }

  const cloneResponse = response.clone();
  let result: ResponseWrapper<T> = await parseJson<T>(response);

  if (!result.data) {
    result = await parseText<T>(cloneResponse);
  }

  if (typeof result.data === "string") {
    result = parseBoolean(result as ResponseWrapper<string>) as ResponseWrapper<T>;
  }

  return result;
};

const parseJson = async <T>(
  response: Response
): Promise<ResponseWrapper<T>> => {
  try {
    return {
      data: await response.json(),
      status: response.status,
      url: response.url,
    };
  } catch {
    return {
      data: undefined as unknown as T,
      status: response.status,
      url: response.url,
    };
  }
};

const parseText = async <T>(
  response: Response
): Promise<ResponseWrapper<T>> => {
  try {
    return {
      data: (await response.text()) as unknown as T,
      status: response.status,
      url: response.url,
    };
  } catch {
    return {
      data: undefined as unknown as T,
      status: response.status,
      url: response.url,
    };
  }
};

const parseBoolean = (
  response: ResponseWrapper<string>
): ResponseWrapper<string | boolean> => {
  const lowerCaseData = response.data?.toLowerCase();
  let booleanResult: boolean | undefined;

  if (lowerCaseData === "true") {
    booleanResult = true;
  } else if (lowerCaseData === "false") {
    booleanResult = false;
  }

  return {
    data: booleanResult ?? response.data,
    status: response.status,
    url: response.url,
  };
};
