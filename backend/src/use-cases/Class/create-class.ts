import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IClass } from "../../entities/Class";
import { ServerError } from "../../entities/ServerError";
import { ICourseCreationRepository } from "../../repositories/Course/CourseCreationRepository";
import { ISchoolAuthorizationRepository } from "../../repositories/School/SchoolAuthorizationRepository";
import { IUserAuthorizationRepository } from "../../repositories/User/UserAuthorizationRepository";
import { EntityError } from "../../entities/EntityError";
import { IClassCreationRepository } from "../../repositories/Class/ClassCreationRepository";

export interface CreateClassInput {
  schoolId: number;
  courseId: number;
  name: string;
}

export type CreateClassOutput = Promise<IClass>;

export class CreateClass {
  constructor(
    private classRepository: IClassCreationRepository,
    private schoolRepository: ISchoolAuthorizationRepository,
    private userRepository: IUserAuthorizationRepository,
  ) {}

  /* 
  
    1 -> A escola na qual a turma será inserida está ativa?

    2 -> O usuário é dono da escola em que a turma será inserida ?
    
    3 -> O curso na qual a turma será inserida pertence a esta escola ?

  */

  private async isUserActive(userId: number) {
    try {
      const isUserActive = await this.userRepository.isUserActive(userId);

      if (!isUserActive) throw new ServerError(403, "Este usuário não é elegível para realizar esta ação");
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") throw new ServerError(404, "Nenhum usuário foi identificado");
      }
      throw error;
    }
  }

  private async courseBelongsToSchool(courseId: number, schoolId: number) {}

  private async isSchoolActive(schoolId: number) {
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

  private async userOwnsSchool(userId: number, schoolId: number) {
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

  async execute({ courseId, name, schoolId }: CreateClassInput, userId: number) {
    if (typeof courseId !== "number") throw new EntityError("");
    if (typeof schoolId !== "number") throw new EntityError("");
    if (typeof userId !== "number") throw new EntityError("");

    if (typeof name !== "string") throw new EntityError("");

    if (name.length > 75) throw new EntityError("");

    await this.classRepository.save({ courseId, name, schoolId });
  }
}
