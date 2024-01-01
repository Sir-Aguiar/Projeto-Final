import { EntityError } from "../../entities/EntityError";
import { IStudent } from "../../entities/Student";
import { IStudentCreationRepository } from "../../repositories/Student/StudentCreationRepository";

/* 
  No controller será verificado o status das outras entidades, aqui tudo que importa são as informações desta entidade
*/

export interface CreateStudentInput {
  classId: number;
  name: string;
}

export type CreateStudentOutput = Promise<IStudent>;

export class CreateStudent {
  constructor(private studentRepository: IStudentCreationRepository) {}

  async execute({ classId, name }: CreateStudentInput): CreateStudentOutput {
    if (typeof classId !== "number") throw new EntityError("Insira um identificador válido para a turma");

    if (typeof name !== "string") throw new EntityError("Insira um nome válido para este aluno(a)");

    if (name.length > 125) throw new EntityError("O nome deste aluno deve ter no máximo 125 caracteres");

    return await this.studentRepository.save({ classId, name });
  }
}
