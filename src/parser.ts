import { ResponseType } from "./types/responseType";
export const parse = (
  response: any,
  responseType?: ResponseType | undefined
): Promise<any> => {
  if (!response.ok) {
    throw response;
  }
  return Promise.resolve(parseResponse(response, responseType));
};

export const parseResponse = async (
  response: any,
  responseType?: ResponseType | undefined
): Promise<any> => {
  const isBlob =
    response.headers?.get("Content-Type") === "application/pdf" ||
    responseType === "blob";
  const isError = response instanceof TypeError || !response;
  const hasNoCloneFunction = !response || typeof response.clone !== "function";
  if (isBlob || isError || hasNoCloneFunction) {
    return response;
  }
  const cloneResponse = response.clone();
  let result = await parseJson(response);
  if (!result.data) {
    result = await parseeText(cloneResponse);
  }
  if (typeof result?.data === "string") {
    result = parseBoolean(result);
  }
  return result;
};

const parseJson = async (response: any): Promise<any> => {
  try {
    return {
      data: await response.json(),
      status: response.status,
      url: response.url,
    };
  } catch {
    return response;
  }
};

const parseeText = async (response: any): Promise<any> => {
  try {
    return {
      data: await response.text(),
      status: response.status,
      url: response.url,
    };
  } catch {
    return response;
  }
};

const parseBoolean = (result: any): any => {
  const data = result.data?.toLowerCase();
  if (data === "true") result.data = true;
  if (data === "false") result.data = false;
  return result;
};
