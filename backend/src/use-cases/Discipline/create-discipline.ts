import { IDiscipline } from "../../entities/Discipline";
import { EntityError } from "../../entities/EntityError";
import { IDisciplineCreationRepository } from "../../repositories/Discipline/DisciplineCreationRepository";

export interface CreateDisciplineInput {
  schoolId: number;
  name: string;
}

export type CreateDisciplineOutput = Promise<IDiscipline>;

export class CreateDiscipline {
  constructor(private disciplineRepository: IDisciplineCreationRepository) {}

  async execute({ name, schoolId }: CreateDisciplineInput): CreateDisciplineOutput {
    if (typeof schoolId !== "number") throw new EntityError("Identificador da escola é inválido");

    if (typeof name !== "string") throw new EntityError("Disciplina possui um nome inválido");

    if (name.length > 50) throw new EntityError("O nome do disciplina pode ter no máximo 50 caracteres");

    return await this.disciplineRepository.save({ name, schoolId });
  }
}
