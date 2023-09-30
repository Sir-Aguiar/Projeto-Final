interface IEscola {
  idEscola: number;
  idGestor: number;
  nome: string;
}

interface ToCreateSchool {
  nome: string;
  turmas: { idCurso: number; nome: string }[];
}

interface ToUpdateSchool {
  nome?: string;
  idGestor?: number;
}

export type { IEscola, ToCreateSchool, ToUpdateSchool };
