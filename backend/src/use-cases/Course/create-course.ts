import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ICourse } from "../../entities/Course";
import { EntityError } from "../../entities/EntityError";
import { ServerError } from "../../entities/ServerError";
import { ICourseCreationRepository } from "../../repositories/Course/CourseCreationRepository";
import { ISchoolAuthorizationRepository } from "../../repositories/School/SchoolAuthorizationRepository";
import { IUserAuthorizationRepository } from "../../repositories/User/UserAuthorizationRepository";

export interface CreateCourseInput {
  schoolId: number;
  name: string;
}

export type CreateCourseOutput = Promise<ICourse>;

export class CreateCourse {
  constructor(
    private courseRepository: ICourseCreationRepository,
    private schoolRepository: ISchoolAuthorizationRepository,
    private userRepository: IUserAuthorizationRepository,
  ) {}

  private async isSchoolElegible(schoolId: number) {
    try {
      const isSchoolElegible = await this.schoolRepository.isSchoolActive(schoolId);

      if (!isSchoolElegible) {
        throw new ServerError(403, "Esta escola não é elegível à receber novos cursos");
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") throw new ServerError(404, "Nenhuma escola foi identificada");
      }
      throw error;
    }
  }

  private async isUserElegible(userId: number, schoolId: number) {
    try {
      const isUserActive = await this.userRepository.isUserActive(userId);

      if (!isUserActive) throw new ServerError(403, "Este usuário não é elegível para realizar esta ação");
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") throw new ServerError(404, "Nenhum usuário foi identificado");
      }
      throw error;
    }

    try {
      const isSchoolOwner = await this.schoolRepository.isSchoolOwner(schoolId, userId);

      if (!isSchoolOwner) throw new ServerError(401, "Este usuário não tem permissão para realizar esta ação");
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") throw new ServerError(404, "Nenhuma escola foi identificada");
      }
      throw error;
    }
  }

  async execute({ name, schoolId }: CreateCourseInput, userId: number) {
    if (typeof name !== "string") throw new EntityError("Curso possui um nome inválido");

    if (typeof schoolId !== "number") throw new EntityError("Identificador da escola é inválido");

    if (typeof userId !== "number") throw new EntityError("Identificador do usuário é inválido");

    if (name.length > 75) throw new EntityError("O nome do curso pode ter no máximo 75 caracteres");

    await this.isSchoolElegible(schoolId);

    await this.isUserElegible(userId, schoolId);

    return await this.courseRepository.save({ name, schoolId });
  }
}
