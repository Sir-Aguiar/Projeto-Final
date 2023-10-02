import { AxiosInstance } from "axios";
import { IAluno, IAlunoStats } from "../@types/Alunos";

const FindStudentsByClass = async (API: AxiosInstance, idTurma: number) => {
  const response = await API.get(`/aluno?idTurma=${idTurma}`);
  return response.data.alunos as IAluno[];
};

const FindStudentsBySchool = async (API: AxiosInstance, idEscola: number, take = 30, skip = 0) => {
  const response = await API.get(`/aluno?idEscola=${idEscola}&take=${take}&skip=${skip}`);
  return response.data.alunos as { rows: IAluno[]; count: number };
};

const FindStudentsStats = async (API: AxiosInstance, idAluno: number, month: number): Promise<IAlunoStats> => {
  const response = await API.get(`/students-stat?idAluno=${idAluno}&month=${month}`);
  return response.data;
};

const UpdateStudent = async (API: AxiosInstance, idAluno: number, toUpdate: any) => {
  const response = await API.put(`/aluno/${idAluno}`, { toUpdate });
  return response;
};

export { FindStudentsByClass, FindStudentsBySchool, FindStudentsStats, UpdateStudent };
