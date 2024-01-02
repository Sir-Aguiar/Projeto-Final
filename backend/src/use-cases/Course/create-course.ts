import { ICourse } from "../../entities/Course";
import { EntityError } from "../../entities/EntityError";
import { ICourseCreationRepository } from "../../repositories/Course/CourseCreationRepository";

export interface CreateCourseInput {
  schoolId: number;
  name: string;
}

export type CreateCourseOutput = Promise<ICourse>;

export class CreateCourse {
  constructor(private courseRepository: ICourseCreationRepository) {}

  async execute({ name, schoolId }: CreateCourseInput, userId: number) {
    if (typeof name !== "string") throw new EntityError("Curso possui um nome inválido");

    if (typeof schoolId !== "number") throw new EntityError("Identificador da escola é inválido");

    if (typeof userId !== "number") throw new EntityError("Identificador do usuário é inválido");

    if (name.length > 75) throw new EntityError("O nome do curso pode ter no máximo 75 caracteres");

    return await this.courseRepository.save({ name, schoolId });
  }
}
