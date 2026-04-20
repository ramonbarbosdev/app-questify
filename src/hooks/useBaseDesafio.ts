import { useState } from 'react';
import { desafioService } from '@/src/services/desafioService';
import { useJogoStore } from '@/src/store/jogoStore';
import { getApiErrorMessage } from '../types/ApiErrorMessage';

export const useBaseDesafio = () => {
  const [resposta, setResposta] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  const desafioAtual = useJogoStore((s) => s.desafioAtual);
  const adicionarTentativa = useJogoStore((s) => s.adicionarTentativa);


  const enviar = async () => {
    if (!resposta.trim() || !desafioAtual) return;
    try {
      const data = await desafioService.enviarResposta({
        idDesafio: desafioAtual.idDesafio,
        resposta,
      });

      if (data.resposta?.valido === false) {
        setErro(data.resposta.mensagem);
        return {
          finalizado: false,
        };
      }

      const status = data.resposta.status;
      const respostaAtual = data.resposta.respostaUsuario ?? resposta;
      adicionarTentativa(status, respostaAtual, data.resposta.feedback);

      setResposta('');
      setErro(null);

      return {
        status,
        sucesso: data.sucesso,
        flFinalizado: data.flFinalizado,
        tpDesafio: data.tpDesafio,
        resposta: respostaAtual, 
        feedback: data.resposta.feedback ?? [], 
      };

    } catch (e) {
      const mensagem = getApiErrorMessage(e);

      setErro(mensagem);

      return {
        finalizado: false,
      };
    }
  };
  return {
    resposta,
    setResposta,
    erro,
    setErro,
    enviar,
  };
};