import { AxiosInstance } from "axios";
import { IAluno, IAlunoStats } from "../@types/Alunos";

const FindStudentsByClass = async (API: AxiosInstance, idTurma: number): Promise<IAluno[]> => {
	const response = await API.get(`/aluno?idTurma=${idTurma}`);
	return response.data.alunos as IAluno[];
};

const FindStudentsBySchool = async (API: AxiosInstance, idEscola: number): Promise<IAluno[]> => {
	const response = await API.get(`/aluno?idEscola=${idEscola}`);
	return response.data.alunos as IAluno[];
};

const FindStudentsStats = async (API: AxiosInstance, idAluno: number, month: number): Promise<IAlunoStats> => {
	const response = await API.get(`/students-stat?idAluno=${idAluno}&month=${month}`);
	return response.data;
};

export { FindStudentsByClass, FindStudentsBySchool, FindStudentsStats };
