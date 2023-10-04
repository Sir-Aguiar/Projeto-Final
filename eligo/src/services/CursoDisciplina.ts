import { AxiosInstance } from "axios";

const CreateDisciplineGrid = async (API: AxiosInstance, idEscola: number, idDisciplina: number, cursos: number[]) => {
  const response = await API.post(`/curso-disciplina?idEscola=${idEscola}&idDisciplina=${idDisciplina}`, { cursos });
  return response;
};

export { CreateDisciplineGrid };
