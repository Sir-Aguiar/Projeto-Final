import { AxiosInstance } from "axios";
import { IEscola, ToCreateSchool, ToUpdateSchool } from "../@types/Escolas";

const FindAllSchools = async (API: AxiosInstance): Promise<IEscola[]> => {
  const response = await API.get("/escola");
  return response.data.escolas as IEscola[];
};
const FindSchoolById = async (API: AxiosInstance, idEscola: number): Promise<IEscola> => {
  const response = await API.get(`/escola?idEscola=${idEscola}`);
  return response.data.escola as IEscola;
};

const DeleteSchools = async (API: AxiosInstance, escolas: number[]) => {
  for (const idEscola of escolas) {
    await API.delete(`/escola?idEscola=${idEscola}`);
  }
};

const CreateSchool = async (API: AxiosInstance, body: ToCreateSchool) => {
  const response = await API.post(`/escola`, { ...body });
  return response;
};

const UpdateSchool = async (API: AxiosInstance, idEscola: number, toUpdate: ToUpdateSchool) => {
  const response = await API.put(`/escola?idEscola=${idEscola}`, { toUpdate });
  return response;
};

export { FindAllSchools, DeleteSchools, CreateSchool, UpdateSchool, FindSchoolById };
