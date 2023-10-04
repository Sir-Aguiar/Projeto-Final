interface IDisciplina {
  idDisciplina: number;
  nome: string;
}

interface ToCreateDiscipline {
  idEscola: number;
  nome: string;
}

export type { IDisciplina, ToCreateDiscipline };
