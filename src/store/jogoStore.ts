import { create } from 'zustand';
import { StatusJogo } from '../types/StatusJogo';

interface JogoState {
  desafioAtual: any;

  tentativas: StatusJogo[];
  respostas: string[];
  feedbacks: string[][];

  setDesafioAtual: (desafio: any) => void;

  adicionarTentativa: (
    tentativa: StatusJogo,
    resposta: string,
    feedback: string[]
  ) => void;

  setResultado: (
    tentativas: StatusJogo[],
    respostas: string[],
    feedbacks: string[][]
  ) => void;

  resetar: () => void;
}

export const useJogoStore = create<JogoState>((set) => ({
  desafioAtual: null,
  tentativas: [],
  respostas: [],
  feedbacks: [], 

  setDesafioAtual: (desafio) =>
    set({ desafioAtual: desafio }),

  adicionarTentativa: (tentativa, resposta, feedback) =>
    set((state) => ({
      tentativas: [...state.tentativas, tentativa],
      respostas: [...state.respostas, resposta],
      feedbacks: [...state.feedbacks, feedback], // ✅ ESSENCIAL
    })),

  setResultado: (tentativas, respostas, feedbacks) =>
    set({
      tentativas: tentativas || [],
      respostas: respostas || [],
      feedbacks: feedbacks || [], // ✅ ESSENCIAL
    }),

  resetar: () =>
    set({
      desafioAtual: null,
      tentativas: [],
      respostas: [],
      feedbacks: [], // ✅ não esquecer
    }),
}));