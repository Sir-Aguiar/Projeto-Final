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
        if (error.code === "P2003") {
          throw new ServerError(403, "Nenhuma escola foi identificada");
        }
      }
      throw error;
    }
  }
}
