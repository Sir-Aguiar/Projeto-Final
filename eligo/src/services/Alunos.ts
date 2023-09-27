import { AxiosInstance } from "axios";
import { IAluno } from "../@types/Alunos";

const FindStudentsByClass = async (API: AxiosInstance, idTurma: number): Promise<IAluno[]> => {
  const response = await API.get(`/aluno?idTurma=${idTurma}`);
  return response.data.alunos as IAluno[];
};

const FindStudentsBySchool = async (API: AxiosInstance, idEscola: number): Promise<IAluno[]> => {
  const response = await API.get(`/aluno?idEscola=${idEscola}`);
  return response.data.alunos as IAluno[];
};

export { FindStudentsByClass, FindStudentsBySchool };
