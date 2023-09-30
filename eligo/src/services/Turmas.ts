import { AxiosInstance } from "axios";
import { ITurma, ToCreateClass, ToUpdateClass } from "../@types/Turmas";

const FindAllClasses = async (API: AxiosInstance): Promise<ITurma[]> => {
  const response = await API.get(`/turma`);
  return response.data.turmas as ITurma[];
};

const FindClassesBySchool = async (API: AxiosInstance, idEscola: number): Promise<ITurma[]> => {
  const response = await API.get(`/turma?idEscola=${idEscola}`);
  return response.data.turmas as ITurma[];
};

const CreateClasses = async (API: AxiosInstance, idEscola: number, RequestBody: ToCreateClass[]) => {
  const response = await API.post(`/turma?idEscola=${idEscola}`, { turmas: RequestBody });
  return response;
};

const UpdateClass = async (API: AxiosInstance, idTurma: number, toUpdate: ToUpdateClass) => {
  const response = await API.put(`/turma?idTurma=${idTurma}`, { toUpdate });
  return response;
};

const DeleteClasses = async (API: AxiosInstance, turmas: number[]) => {
  for (const idTurma of turmas) {
    await API.delete(`/turma?idTurma=${idTurma}`);
  }
};

const FindClassStats = async (API: AxiosInstance, idTurma: number) => {
  const response = await API.get(`/class-stats?idTurma=${idTurma}`);
  return response.data;
};

export { FindClassesBySchool, FindAllClasses, FindClassStats, UpdateClass, CreateClasses, DeleteClasses };
