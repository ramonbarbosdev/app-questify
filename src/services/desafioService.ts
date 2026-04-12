import { api } from '@/src/api/api';

export const desafioService = {
  async buscarDesafio(idDispositivo: string) {
     idDispositivo = 'device-123';
    const res = await api.get(`/desafio/atual/${idDispositivo}`);
    return res.data; 
  },


  async enviarResposta(payload: {
    idDesafio: number;
    resposta: string;
  }) {
    const res = await api.post('/resultado/resposta', {
      idDesafio: payload.idDesafio,
      dsResposta: payload.resposta,
      idDispositivo: 'device-123',
    });

    return res.data;
  },
};