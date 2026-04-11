export const getApiErrorMessage = (e: any): string => {
  if (e?.response?.data) {
    return e.response.data.message;
  }
  return 'Erro de conexão';
};