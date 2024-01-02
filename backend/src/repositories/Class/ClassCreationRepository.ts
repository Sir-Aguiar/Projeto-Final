import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Database } from "../../database/prisma";
import { CreateClassInput, CreateClassOutput } from "../../use-cases/Class/create-class";
import { ServerError } from "../../entities/ServerError";

export interface IClassCreationRepository {
  save({ courseId, name, schoolId }: CreateClassInput): CreateClassOutput;
}

export class ClassCreationRepository implements IClassCreationRepository {
  async save({ courseId, name, schoolId }: CreateClassInput): CreateClassOutput {
    try {
      const createdClass = await Database.class.create({ data: { name, schoolId, courseId } });
      return createdClass;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          if (error.meta?.field_name === "schoolId") throw new ServerError(403, "Nenhuma escola foi identificada");
          if (error.meta?.field_name === "courseId") throw new ServerError(403, "Nenhum curso foi identificado");
        }
      }
      throw error;
    }
  }
}
