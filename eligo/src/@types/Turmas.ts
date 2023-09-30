import { IEscola } from "./Escolas";

interface ICurso {
  idCurso: number;
  nome: string;
}

interface ITurma {
  idTurma: number;
  nome: string;
  curso: ICurso;
  escola: IEscola;
}

interface ITurmaStats {}

interface ToCreateClass {
  idCurso: number;
  nome: string;
}

interface ToUpdateClass {
  nome?: string;
  idCurso?: number;
}

export type { ITurma, ICurso, ITurmaStats, ToCreateClass, ToUpdateClass };
