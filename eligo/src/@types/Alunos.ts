import { IEscola } from "./Escolas";
import { ITurma } from "./Turmas";

interface IAluno {
  idAluno: number;
  nome: string;
  escola: IEscola;
  turma: ITurma;
}

export type { IAluno };
