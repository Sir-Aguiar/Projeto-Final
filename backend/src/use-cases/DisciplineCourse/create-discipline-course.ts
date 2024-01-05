import { IDisciplineCourse } from "../../entities/DisciplineCourse";
import { EntityError } from "../../entities/EntityError";
import { IDisciplineCourseCreationRepository } from "../../repositories/CourseDiscipline/DisciplineCourseCreationRepository";

export interface CreateDisciplineCourseInput {
  courseId: number;
  disciplineId: number;
}

export type CreateDisciplineCourseOutput = Promise<IDisciplineCourse>;

export class CreateDisciplineCourse {
  constructor(private disciplineCourseRepository: IDisciplineCourseCreationRepository) {}

  async execute({ courseId, disciplineId }: CreateDisciplineCourseInput) {
    if (typeof courseId !== "number") throw new EntityError("O curso possui um identificador inválido");

    if (typeof disciplineId !== "number") throw new EntityError("A disciplina possui um identificador inválido");

    return await this.disciplineCourseRepository.save({ courseId, disciplineId });
  }
}
