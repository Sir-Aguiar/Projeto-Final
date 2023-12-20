import "dotenv/config";
import { IUserCreationRepository } from "../../repositories/UserCreationRepository";
import { hashSync } from "bcrypt";
import { IUser } from "../../entities/User";
import { EntityError } from "../../entities/EntityError";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export type CreateUserOutput = Promise<IUser>;

export class CreateUser {
  constructor(private repository: IUserCreationRepository) {}

  async execute({ email, name, password }: CreateUserInput) {
    if (typeof name !== "string") throw new EntityError("Insira um nome válido para a criação de usuário");

    if (typeof email !== "string") throw new EntityError("Insira um email válido para a criação de usuário");

    if (typeof password !== "string") throw new EntityError("Insira uma senha válida para a criação de usuário");

    if (name.length > 70) throw new EntityError("Seu nome deve ter até 70 caracteres, use abreviações se necessário");

    if (email.length > 320) throw new EntityError("Seu email pode ter no máximo 320 caracteres");

    if (password.length < 6) throw new EntityError("Por favor, insira uma senha com mais de 6 dígitos");

    return await this.repository.save({ email, name, password: hashSync(password, Number(process.env.SALT)) });
  }
}
