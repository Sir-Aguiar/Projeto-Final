import { IUser } from "../entities/User";
import { CreateUserInput, CreateUserOutput } from "../use-cases/User/create-user";

export interface IUserRepository {
  save(data: CreateUserInput): CreateUserOutput;
}

export class UserRepository implements IUserRepository {
  async save({ email, name, password }: CreateUserInput): CreateUserOutput {
    try {
      return {} as IUser;
    } catch (error: any) {
      throw new Error("");
    }
  }
}
