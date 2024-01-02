import { Database } from "../../database/prisma";
import { ISchool } from "../../entities/School";

export interface ISchoolQueryRepository {
  findById(schoolId: number): Promise<ISchool>;
}

export class SchoolQueryRepository implements ISchoolQueryRepository {
  async findById(schoolId: number): Promise<ISchool> {
    const school = await Database.school.findUniqueOrThrow({ where: { schoolId } });
    return school;
  }
}
