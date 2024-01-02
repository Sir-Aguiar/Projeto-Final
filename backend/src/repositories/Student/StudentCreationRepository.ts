import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreateStudentInput, CreateStudentOutput } from "../../use-cases/Student/create-student";
import { ServerError } from "../../entities/ServerError";
import { Database } from "../../database/prisma";

export interface IStudentCreationRepository {
  save({ classId, name }: CreateStudentInput): CreateStudentOutput;
}

export class StudentCreationRepository implements IStudentCreationRepository {
  async save({ classId, name }: CreateStudentInput): CreateStudentOutput {
    try {
      const student = await Database.student.create({ data: { name, classId } });
      return student;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          if (error.meta?.field_name === "classId") throw new ServerError(403, "Nenhuma turma foi identificada");
        }
      }
      throw error;
    }
  }
}
