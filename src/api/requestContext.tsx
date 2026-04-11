type RequestContextData = {
  id_entidade?: string;
  id_unidade?: string;
  id_usuario?: string;
  ano_exercicio?: number;
};

let requestContext: RequestContextData = {};

export function setRequestContext(
  data: Partial<RequestContextData>
) {
  requestContext = {
    ...requestContext,
    ...data,
  };
}

export function getRequestContext(): RequestContextData {
  return requestContext;
}