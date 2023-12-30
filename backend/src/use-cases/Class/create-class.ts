import { IClass } from "../../entities/Class";
import { EntityError } from "../../entities/EntityError";
import { IClassCreationRepository } from "../../repositories/Class/ClassCreationRepository";

/* 
  Quais são as responsabilidades de cada camada da aplicação

  REQUEST -> Middleware -> Controller -> Use-Case -> Repository  

  Questões de atividades devem ser abordadas em repositories ou em use-cases?

*/

export interface CreateClassInput {
  schoolId: number;
  courseId: number;
  name: string;
}

export type CreateClassOutput = Promise<IClass>;

export class CreateClass {
  constructor(private classRepository: IClassCreationRepository) {}

  async execute({ courseId, name, schoolId }: CreateClassInput) {
    if (typeof courseId !== "number") throw new EntityError("Insira um identificador válido para o curso");
    if (typeof schoolId !== "number") throw new EntityError("Insira um identificador válido para a escola");

    if (typeof name !== "string") throw new EntityError("Insira um nome válido para a turma");

    if (name.length > 75) throw new EntityError("O nome da turma deve ter no máximo 75 caracteres");

    return await this.classRepository.save({ courseId, name, schoolId });
  }
}
