import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IUser } from "../../entities/User";
import { Database } from "../../database/prisma";
import { ServerError } from "../../entities/ServerError";

export interface IUserAuthenticationRepository {
  findByEmail(email: string): Promise<IUser>;
}

export class UserAuthenticationRepository implements IUserAuthenticationRepository {
  async findByEmail(email: string) {
    try {
      const user = await Database.user.findUniqueOrThrow({ where: { email } });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ServerError(404, "Nenhum usuário foi encontrado com este email");
        }
      }
      throw error;
    }
  }
}
