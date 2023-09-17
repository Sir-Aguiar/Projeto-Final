interface IProfessorState {
  length: number;
  data: {
    idProfessor: number;
    nome: string;
    turma: {
      idTurma: string;
      nome: string;
    };
    disciplina: {
      idDisciplina: number;
      nome: string;
    };
  }[];
}

interface IDisciplinaState {
  // Contagem de quantas disciplinas aquela escola tem associada à um ou mais cursos
  length: number;
  data: {
    idDisciplina: number;
    nome: string;
  }[];
}

interface IGradeState {
  length: number;
  data: {
    idDisciplina: number;
    nome: string;
    curso: {
      idCurso: number;
      nome: string;
    };
  }[];
}
