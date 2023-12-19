import { Database } from "../database/prisma";
import { CreateUserInput, CreateUserOutput } from "../use-cases/User/create-user";
import { ServerError } from "../entities/ServerError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export interface IUserRepository {
  save(data: CreateUserInput): CreateUserOutput;
}

export class UserRepository implements IUserRepository {
  async save({ email, name, password }: CreateUserInput): CreateUserOutput {
    try {
      const createdUser = await Database.user.create({ data: { email, name, password } });
      return createdUser;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ServerError(400, "Já existe um usuário cadastrado com este email");
        }
      }
      throw error;
    }
  }
}
