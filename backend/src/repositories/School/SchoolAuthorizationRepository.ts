import { Database } from "../../database/prisma";
import { ISchoolQueryRepository, SchoolQueryRepository } from "./SchoolQueryRepository";

export interface ISchoolAuthorizationRepository {
  schoolQueryRepository: ISchoolQueryRepository;
  isSchoolActive(schoolId: number): Promise<boolean>;
  isSchoolOwner(schoolId: number, userId: number): Promise<boolean>;
}

export class SchoolAuthorizationRepository implements ISchoolAuthorizationRepository {
  schoolQueryRepository: ISchoolQueryRepository;

  constructor() {
    this.schoolQueryRepository = new SchoolQueryRepository();
  }

  async isSchoolActive(schoolId: number): Promise<boolean> {
    const { deletedAt } = await this.schoolQueryRepository.findById(schoolId);

    if (deletedAt) return false;
    return true;
  }

  async isSchoolOwner(schoolId: number, userId: number): Promise<boolean> {
    const { ownerId } = await this.schoolQueryRepository.findById(schoolId);

    if (ownerId !== userId) return false;
    return true;
  }
}
