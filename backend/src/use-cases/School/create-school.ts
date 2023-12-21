import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { EntityError } from "../../entities/EntityError";
import { ISchool } from "../../entities/School";
import { ServerError } from "../../entities/ServerError";
import { ISchoolCreationRepository } from "../../repositories/School/SchoolCreationRepository";
import { IUserQueryRepository } from "../../repositories/User/UserQueryRepository";

export interface CreateSchoolInput {
  ownerId: number;
  name: string;
}

export type CreateSchoolOutput = Promise<ISchool>;

export class CreateSchool {
  constructor(private schoolRepository: ISchoolCreationRepository, private queryRepository: IUserQueryRepository) {}

  private async isUserElegible(ownerId: number) {
    try {
      const { deletedAt } = await this.queryRepository.findById(ownerId);

      if (deletedAt) {
        throw new ServerError(403, "Este usuário não é elegível para cadastrar uma escola");
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ServerError(404, "Nenhum usuário foi identificado");
        }
      }

      throw error;
    }
  }

  async execute({ name, ownerId }: CreateSchoolInput) {
    if (typeof name !== "string") throw new EntityError("Insira um nome válido para o cadastro da escola");

    if (typeof ownerId !== "number") throw new EntityError("Identificador do usuário inválido");

    if (name.length > 100) throw new EntityError("Nome da escola deve ter até 100 caracteres");

    await this.isUserElegible(ownerId);

    return await this.schoolRepository.save({ name, ownerId });
  }
}
