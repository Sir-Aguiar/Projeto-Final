import { AxiosInstance } from "axios";
import { IEscola } from "../@types/Escolas";

const FindAllSchools = async (API: AxiosInstance): Promise<IEscola[]> => {
  const response = await API.get("/escola");
  return response.data.escolas as IEscola[];
};

export { FindAllSchools };
