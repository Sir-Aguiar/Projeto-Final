import { IEscola } from "./Escolas";
import { ITurma } from "./Turmas";

interface IAluno {
	idAluno: number;
	nome: string;
	escola: IEscola;
	turma: ITurma;
}

interface IAlunoStats {
	aluno: {
		idAluno: number;
		nome: string;
		turma: {
			idTurma: number;
			nome: string;
			curso: {
				idCurso: number;
				nome: string;
			};
		};
		escola: {
			idEscola: number;
			idGestor: number;
			nome: string;
		};
	};
	faltas_ano: [[string, number]];
	media_falta_mes: number;
	faltas_mes: {
		faltas: number;
		disciplinas: [
			{
				disciplina: {
					idDisciplina: number;
					nome: string;
				};
				faltas: number;
			},
		];
	};
	faltas_total: number;
}

export type { IAluno, IAlunoStats };
