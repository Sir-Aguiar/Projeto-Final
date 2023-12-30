export interface ISchool {
  schoolId: number;
  ownerId: number;
  name: string;
  createdAt: Date;
  deletedAt: Date | null;
}

export class School {}
