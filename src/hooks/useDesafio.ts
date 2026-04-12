import { useState } from 'react';
import { desafioService } from '@/src/services/desafioService';
import { getApiErrorMessage } from '@/src/types/ApiErrorMessage';
import { useJogoStore } from '@/src/store/jogoStore';
import { StatusJogo } from '../types/StatusJogo';

const MAX_TENTATIVAS = 5;

export const useDesafio = () => {
  const [resposta, setResposta] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  const desafioAtual = useJogoStore((s) => s.desafioAtual);
  const tentativas = useJogoStore((s) => s.tentativas);
  const adicionarTentativa = useJogoStore((s) => s.adicionarTentativa);

  const enviarResposta = async () => {
    if (!resposta.trim() || !desafioAtual || finalizado) return;

    try {
      setCarregando(true);

      const data = await desafioService.enviarResposta({
        idDesafio: desafioAtual.idDesafio,
        resposta,
      });

      if (data.resposta?.valido === false) {
        setErro(data.resposta.mensagem);
        return;
      }

      const status: StatusJogo =
        data.resposta?.status || 'errado';

      adicionarTentativa(status, resposta);

      setResposta('');
      setErro(null);

      if (
        data.sucesso ||
        tentativas.length + 1 >= MAX_TENTATIVAS
      ) {
        setFinalizado(true);
      }

    } catch (e) {
      setErro(getApiErrorMessage(e));
    } finally {
      setCarregando(false);
    }
  };

  return {
    resposta,
    setResposta,
    erro,
    carregando,
    finalizado,
    enviarResposta,
  };
};