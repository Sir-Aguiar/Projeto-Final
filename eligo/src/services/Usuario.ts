import { AxiosInstance } from "axios";
import { IUsuario, ToUpdateUser } from "../@types/Usuario";

const FindUser = async (API: AxiosInstance): Promise<IUsuario> => {
  const response = await API.get("/usuario");
  return response.data.usuario;
};

const UpdateUser = async (API: AxiosInstance, toUpdate: ToUpdateUser) => {
  const response = await API.put("/usuario", { toUpdate });
  return response;
};

const UpdateProfileImage = async (API: AxiosInstance, formData: FormData) => {
  const response = await API.post("/profile-image", formData);
  return response;
};

export { UpdateProfileImage, FindUser, UpdateUser };
