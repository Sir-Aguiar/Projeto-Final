export interface IStudent {
  studentId: number;
  classId: number;
  name: string;
  createdAt: Date;
  deletedAt: Date | null;
}

export class Student {}
