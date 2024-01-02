export interface IClass {
  classId: number;
  schoolId: number;
  courseId: number;
  name: string;
  createdAt: Date;
  deletedAt: Date | null;
}

export class Class {}
