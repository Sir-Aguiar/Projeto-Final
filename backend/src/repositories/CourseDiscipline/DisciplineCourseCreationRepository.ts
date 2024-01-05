import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Database } from "../../database/prisma";
import { ServerError } from "../../entities/ServerError";
import {
  CreateDisciplineCourseInput,
  CreateDisciplineCourseOutput,
} from "../../use-cases/DisciplineCourse/create-discipline-course";

export interface IDisciplineCourseCreationRepository {
  save({ courseId, disciplineId }: CreateDisciplineCourseInput): CreateDisciplineCourseOutput;
}

export class DisciplineCourseCreationRepository implements IDisciplineCourseCreationRepository {
  async save({ courseId, disciplineId }: CreateDisciplineCourseInput) {
    try {
      return Database.disciplineCourse.create({ data: { courseId, disciplineId } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Pode já existir

        if (error.code === "P2003") {
          if (error.meta?.field_name === "courseId") {
            throw new ServerError(404, "Nenhum curso foi identificado");
          }
          if (error.meta?.field_name === "disciplineId") {
            throw new ServerError(404, "Nenhuma disciplina foi identificada");
          }
        }
      }

      throw error;
    }
  }
}
