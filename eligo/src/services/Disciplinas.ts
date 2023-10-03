import { AxiosInstance } from "axios";
import { IDisciplina } from "../@types/Disciplinas";

const FindDisciplinesByClass = async (API: AxiosInstance, idTurma: number) => {
  const response = await API.get(`/disciplina?idTurma=${idTurma}`);
  return response.data.disciplinas as IDisciplina[];
};

export { FindDisciplinesByClass };
