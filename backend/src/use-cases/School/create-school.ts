import { EntityError } from "../../entities/EntityError";
import { ISchool } from "../../entities/School";
import { ISchoolCreationRepository } from "../../repositories/School/SchoolCreationRepository";

export interface CreateSchoolInput {
  ownerId: number;
  name: string;
}

export type CreateSchoolOutput = Promise<ISchool>;

export class CreateSchool {
  constructor(private schoolRepository: ISchoolCreationRepository) {}

  async execute({ name, ownerId }: CreateSchoolInput) {
    if (typeof name !== "string") throw new EntityError("Insira um nome válido para o cadastro da escola");

    if (typeof ownerId !== "number") throw new EntityError("Identificador do usuário inválido");

    if (name.length > 100) throw new EntityError("Nome da escola deve ter até 100 caracteres");
    // Verifica se o usuário existe e possui uma conta ativa
    return await this.schoolRepository.save({ name, ownerId });
  }
}
