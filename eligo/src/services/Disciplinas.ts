import { AxiosInstance } from "axios";
import { IDisciplina, ToCreateDiscipline } from "../@types/Disciplinas";

const FindDisciplinesByClass = async (API: AxiosInstance, idTurma: number) => {
  const response = await API.get(`/disciplina?idTurma=${idTurma}`);
  return response.data.disciplinas as IDisciplina[];
};

const FindDisciplinesBySchool = async (API: AxiosInstance, idEscola: number) => {
  const response = await API.get(`/disciplina?idEscola=${idEscola}`);
  return response.data.disciplinas as IDisciplina[];
};

const FindDisciplinesCountBySchool = async (API: AxiosInstance, idEscola: number) => {
  const response = await API.get(`/disciplina?idEscola=${idEscola}&onlyLength=true`);
  return response.data.disciplinas as number;
};

const CreateDiscipline = async (API: AxiosInstance, RequestBody: ToCreateDiscipline): Promise<IDisciplina> => {
  const response = await API.post("/disciplina", RequestBody);
  return response.data.disciplina as IDisciplina;
};

export { FindDisciplinesByClass, FindDisciplinesBySchool, FindDisciplinesCountBySchool, CreateDiscipline };
