import { AxiosInstance } from "axios";
import { IUsuario } from "../@types/Usuario";

const FindUser = async (API: AxiosInstance): Promise<IUsuario> => {
  const response = await API.get("/usuario");
  return response.data.usuario;
};

const UpdateProfileImage = async (API: AxiosInstance, formData: FormData) => {
  const response = await API.post("/profile-image", formData);
  return response;
};

export { UpdateProfileImage, FindUser };
