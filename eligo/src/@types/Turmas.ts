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

export type { ITurma, ICurso };
