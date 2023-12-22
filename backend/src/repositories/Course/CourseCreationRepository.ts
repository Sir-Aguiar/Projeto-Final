import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Database } from "../../database/prisma";
import { CreateCourseInput, CreateCourseOutput } from "../../use-cases/Course/create-course";
import { ServerError } from "../../entities/ServerError";

export interface ICourseCreationRepository {
  save({ name, schoolId }: CreateCourseInput): CreateCourseOutput;
}

export class CourseCreationRepository implements ICourseCreationRepository {
  async save({ name, schoolId }: CreateCourseInput): CreateCourseOutput {
    try {
      const course = await Database.course.create({ data: { name, schoolId } });
      return course;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ServerError(404, "Nenhuma escola foi identificado");
        }
      }
      throw error;
    }
  }
}
