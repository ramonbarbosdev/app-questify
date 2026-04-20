import { api } from '@/src/api/api';
import { getDeviceId } from '@/src/utils/device';

export const desafioService = {

  async buscarDesafio() {
    const idDispositivo = await getDeviceId();
    const res = await api.get(`/desafio/atual/${idDispositivo}`);
    return res.data;
  },

  async enviarResposta(payload: {
    idDesafio: number;
    resposta: string;
  }) {

    const idDispositivo = await getDeviceId();

    const res = await api.post('/resultado/resposta', {
      idDesafio: payload.idDesafio,
      dsResposta: payload.resposta,
      idDispositivo: idDispositivo,
    });

    return res.data;
  },
};