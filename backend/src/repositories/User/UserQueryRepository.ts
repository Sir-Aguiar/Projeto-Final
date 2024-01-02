import { Database } from "../../database/prisma";
import { IUser } from "../../entities/User";

export interface IUserQueryRepository {
  findById(userId: number): Promise<IUser>;
}

export class UserQueryRepository implements IUserQueryRepository {
  async findById(userId: number): Promise<IUser> {
    return Database.user.findUniqueOrThrow({ where: { userId } });
  }
}
