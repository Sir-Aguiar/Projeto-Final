import { AxiosInstance } from "axios";
import { ToCreateLesson } from "../@types/Aulas";

const CreateLesson = async (API: AxiosInstance, RequestBody: ToCreateLesson) => {
  const response = await API.post(`/aula`, RequestBody);
  return response.data;
};

const FindTodayLessonsBySchool = async (API: AxiosInstance, idEscola: number) => {};

export { CreateLesson };
