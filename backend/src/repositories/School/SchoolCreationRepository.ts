import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Database } from "../../database/prisma";
import { CreateSchoolInput, CreateSchoolOutput } from "../../use-cases/School/create-school";
import { ServerError } from "../../entities/ServerError";

export interface ISchoolCreationRepository {
  save({ name, ownerId }: CreateSchoolInput): CreateSchoolOutput;
}

export class SchoolCreationRepository implements ISchoolCreationRepository {
  async save({ name, ownerId }: CreateSchoolInput): CreateSchoolOutput {
    try {
      const school = await Database.school.create({ data: { name, ownerId } });
      return school;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "") {
          throw new ServerError(404, "Nenhum usuário foi identificado");
        }
      }
      throw error;
    }
  }
}
