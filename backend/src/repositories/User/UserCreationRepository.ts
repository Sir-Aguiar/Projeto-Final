import { Database } from "../../database/prisma";
import { CreateUserInput, CreateUserOutput } from "../../use-cases/User/create-user";
import { ServerError } from "../../entities/ServerError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export interface IUserCreationRepository {
  save(data: CreateUserInput): CreateUserOutput;
}

export class UserCreationRepository implements IUserCreationRepository {
  async save({ email, name, password }: CreateUserInput): CreateUserOutput {
    try {
      const createdUser = await Database.user.create({ data: { email, name, password } });
      return createdUser;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ServerError(403, "Já existe um usuário cadastrado com este email");
        }
      }
      throw error;
    }
  }
}
