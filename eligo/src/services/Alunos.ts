import { AxiosInstance } from "axios";
import { IAluno, IAlunoStats, ToCreateStudent } from "../@types/Alunos";

const FindStudentsByClass = async (API: AxiosInstance, idTurma: number) => {
  const response = await API.get(`/aluno?idTurma=${idTurma}`);
  return response.data.alunos as IAluno[];
};

const FindStudentsBySchool = async (API: AxiosInstance, idEscola: number, take = 30, skip = 0) => {
  const response = await API.get(`/aluno?idEscola=${idEscola}&take=${take}&skip=${skip}`);
  return response.data.alunos as { rows: IAluno[]; count: number };
};
const FindStudentsCountBySchool = async (API: AxiosInstance, idEscola: number) => {
  const response = await API.get(`/aluno?idEscola=${idEscola}&onlyLength=true`);
  return response.data.alunos as number;
};

const FindStudentsStats = async (API: AxiosInstance, idAluno: number, month: number): Promise<IAlunoStats> => {
  const response = await API.get(`/students-stat?idAluno=${idAluno}&month=${month}`);
  return response.data;
};

const UpdateStudent = async (API: AxiosInstance, idAluno: number, toUpdate: any) => {
  const response = await API.put(`/aluno/${idAluno}`, { toUpdate });
  return response;
};

const CreateStudent = async (API: AxiosInstance, alunos: ToCreateStudent[]) => {
  const response = await API.post(`/aluno`, { alunos });
  return response;
};

const DeleteStudent = async (API: AxiosInstance, idAluno: number) => {
  const response = await API.delete(`/aluno?idAluno=${idAluno}`);
  return response;
};

export {
  FindStudentsByClass,
  FindStudentsBySchool,
  FindStudentsStats,
  UpdateStudent,
  FindStudentsCountBySchool,
  CreateStudent,
  DeleteStudent,
};
