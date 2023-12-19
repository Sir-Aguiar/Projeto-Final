import "dotenv/config";
import { IUserRepository } from "../../repositories/UserRepository";
import { hashSync } from "bcrypt";
import { IUser } from "../../entities/User";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export type CreateUserOutput = Promise<IUser>;

export class CreateUser {
  constructor(private repository: IUserRepository) {}

  async execute({ email, name, password }: CreateUserInput) {
    if (typeof name !== "string") throw new Error();
    if (name.length > 255) throw new Error();

    if (typeof email !== "string") throw new Error();
    if (email.length > 255) throw new Error();

    if (typeof password !== "string") throw new Error();
    if (password.length > 255) throw new Error();

    return await this.repository.save({ email, name, password: hashSync(password, Number(process.env.SALT)) });
  }
}
