import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Database } from "../../database/prisma";
import { CreateDisciplineInput, CreateDisciplineOutput } from "../../use-cases/Discipline/create-discipline";
import { ServerError } from "../../entities/ServerError";

export interface IDisciplineCreationRepository {
  save({ name, schoolId }: CreateDisciplineInput): CreateDisciplineOutput;
}

export class DisciplineCreationRepository implements IDisciplineCreationRepository {
  async save({ name, schoolId }: CreateDisciplineInput): CreateDisciplineOutput {
    try {
      const discipline = await Database.discipline.create({ data: { name, schoolId } });
      return discipline;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          if (error.meta?.field_name === "schoolId") throw new ServerError(403, "Nenhuma escola foi identificada");
        }
      }
      throw error;
    }
  }
}
