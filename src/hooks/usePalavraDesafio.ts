import { useBaseDesafio } from './useBaseDesafio';

export const usePalavraDesafio = () => {
  const base = useBaseDesafio();

  const enviarResposta = async () => {
    const result = await base.enviar();
    if (!result) return;

    const finalizado =
      result.sucesso || result.flFinalizado ; 

    return {
      ...result,
      finalizado,
    };
  };

  return {
    ...base,
    enviarResposta,
  };
};