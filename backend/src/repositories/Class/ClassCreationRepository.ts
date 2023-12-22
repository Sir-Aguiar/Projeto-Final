import { Database } from "../../database/prisma";
import { CreateClassInput, CreateClassOutput } from "../../use-cases/Class/create-class";

export interface IClassCreationRepository {
  save({ courseId, name, schoolId }: CreateClassInput): CreateClassOutput;
}

export class ClassCreationRepository implements IClassCreationRepository {
  async save({ courseId, name, schoolId }: CreateClassInput): CreateClassOutput {
    try {
      const createdClass = await Database.class.create({ data: { name, schoolId, courseId } });
      return createdClass;
    } catch (error) {
      throw error;
    }
  }
}
