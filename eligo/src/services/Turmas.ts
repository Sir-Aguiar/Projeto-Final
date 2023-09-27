import { AxiosInstance } from "axios";
import { ITurma } from "../@types/Turmas";

const FindAllClasses = async (API: AxiosInstance): Promise<ITurma[]> => {
	const response = await API.get(`/turma`);
	return response.data.turmas as ITurma[];
};

const FindClassesBySchool = async (API: AxiosInstance, idEscola: number): Promise<ITurma[]> => {
	const response = await API.get(`/turma?idEscola=${idEscola}`);
	return response.data.turmas as ITurma[];
};

const FindClassStats = async (API: AxiosInstance, idTurma: number) => {
	const response = await API.get(`/class-stats?idTurma=${idTurma}`);
	return response.data;
};

export { FindClassesBySchool, FindAllClasses, FindClassStats };
