import { create } from 'zustand';
import { StatusJogo } from '../types/StatusJogo';

interface JogoState {
  // 🔹 fluxo
  desafios: any[];
  desafioAtual: any;
  indiceAtual: number;

  // 🔹 jogo
  tentativas: StatusJogo[];
  respostas: string[];
  feedbacks: string[][];

  // 🔹 setters fluxo
  setDesafios: (desafios: any[]) => void;
  setDesafioAtual: (desafio: any) => void;
  setIndiceAtual: (index: number) => void;
  proximoDesafio: () => void;

  // 🔹 jogo
  adicionarTentativa: (
    tentativa: StatusJogo,
    resposta: string,
    feedback?: string[]
  ) => void;

  setResultado: (
    tentativas: StatusJogo[],
    respostas: string[],
    feedbacks: string[][]
  ) => void;

  resetar: () => void;
}

export const useJogoStore = create<JogoState>((set) => ({
  // 🔹 fluxo
  desafios: [],
  desafioAtual: null,
  indiceAtual: 0,

  // 🔹 jogo
  tentativas: [],
  respostas: [],
  feedbacks: [],

  // 🔹 fluxo setters
  setDesafios: (desafios) =>
    set({ desafios }),

  setDesafioAtual: (desafio) =>
    set({ desafioAtual: desafio }),

  setIndiceAtual: (index) =>
    set({ indiceAtual: index }),

  proximoDesafio: () =>
    set((state) => {
      const nextIndex = state.indiceAtual + 1;

      return {
        indiceAtual: nextIndex,
        desafioAtual: state.desafios[nextIndex] || null,

        // 🔥 limpa estado do desafio anterior
        tentativas: [],
        respostas: [],
        feedbacks: [],
      };
    }),

  // 🔹 jogo
  adicionarTentativa: (tentativa, resposta, feedback) =>
    set((state) => ({
      tentativas: [...state.tentativas, tentativa],
      respostas: [...state.respostas, resposta],
      feedbacks: [...state.feedbacks, feedback ?? []],
    })),

  setResultado: (tentativas, respostas, feedbacks) =>
    set({
      tentativas: tentativas || [],
      respostas: respostas || [],
      feedbacks: feedbacks || [],
    }),

  // 🔹 reset geral
  resetar: () =>
    set({
      desafios: [],
      desafioAtual: null,
      indiceAtual: 0,

      tentativas: [],
      respostas: [],
      feedbacks: [],
    }),
}));
