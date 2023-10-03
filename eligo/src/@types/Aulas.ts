interface ToCreateLesson {
  idDisciplina: number;
  idTurma: number;
  idProfessor: number;
  observacoes: string;
  presentes: number[];
}

export type { ToCreateLesson };
