import { api } from "./api";
import { getRequestContext } from "./requestContext";

type Params = Record<string, any>;

export async function get<T>(
  url: string,
  params?: Params
): Promise<T> {
  const contextParams = getRequestContext();


  const response = await api.get(url, {
    params: {
      ...contextParams,
      ...params,
    },
  });

  return response.data;
}

export async function post<T>(
  url: string,
  body?: any,
  params?: Params
): Promise<T> {
  const contextParams = getRequestContext();

  const response = await api.post(url, body, {
    params: {
      ...contextParams,
      ...params,
    },
  });

  return response.data;
}