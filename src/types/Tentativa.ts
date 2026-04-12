import { StatusJogo } from "./StatusJogo";

export type Tentativa =
  | TentativaPalavra
  | TentativaPadrao
  | TentativaNumero
  | TentativaQuiz;


export type LetraFeedback = {
  char: string;
  status: StatusJogo;
};

export type TentativaPalavra = {
  tipo: 'PALAVRA';
  palavra: string;
  feedback: LetraFeedback[];
  statusGeral: StatusJogo;
};

export type TentativaPadrao = {
  tipo: 'PADRAO';
  resposta: string;
  status: StatusJogo;
  mensagem?: string;
};

export type TentativaNumero = {
  tipo: 'NUMERO';
  valor: number;
  status: StatusJogo;
};

export type TentativaQuiz = {
  tipo: 'QUIZ';
  alternativaId: string;
  status: StatusJogo;
};
