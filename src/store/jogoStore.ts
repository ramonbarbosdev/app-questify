import { create } from 'zustand';
import { StatusJogo } from '../types/StatusJogo';

interface JogoState {
  desafioAtual: any;

  tentativas: StatusJogo[];
  respostas: string[];

  setDesafioAtual: (desafio: any) => void;

  adicionarTentativa: (tentativa: StatusJogo, resposta: string) => void;

  setResultado: (tentativas: StatusJogo[], respostas: string[]) => void;

  resetar: () => void;
}

export const useJogoStore = create<JogoState>((set) => ({
  desafioAtual: null,
  tentativas: [],
  respostas: [],

  setDesafioAtual: (desafio) =>
    set({ desafioAtual: desafio }),

  adicionarTentativa: (tentativa, resposta) =>
    set((state) => ({
      tentativas: [...state.tentativas, tentativa],
      respostas: [...state.respostas, resposta],
    })),

  setResultado: (tentativas, respostas) =>
    set({
      tentativas: tentativas || [],
      respostas: respostas || [],
    }),

  resetar: () =>
    set({
      desafioAtual: null,
      tentativas: [],
      respostas: [],
    }),
}));