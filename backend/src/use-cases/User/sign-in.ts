import { compareSync } from "bcrypt";
import { EntityError } from "../../entities/EntityError";
import { SignAuthorizationToken } from "../../server/utils/sign-jwt";
import { ServerError } from "../../entities/ServerError";
import { IUserAuthenticationRepository } from "../../repositories/UserAuthenticationRepository";

export interface SignInInput {
  email: string;
  password: string;
}

export type SignInOutpup = any;

export class SignUserIn {
  constructor(private AuthRepository: IUserAuthenticationRepository) {}
  async execute({ email, password }: SignInInput): Promise<string> {
    if (typeof email !== "string" || email.length > 320) throw new EntityError("Email inválido para autenticação");

    if (typeof password !== "string" || password.length < 6) throw new EntityError("Senha inválida para autenticação");

    const userData = await this.AuthRepository.findByEmail(email);

    if (compareSync(password, userData.password)) {
      return SignAuthorizationToken({ email, name: userData.name, userId: userData.userId });
    }

    throw new ServerError(401, "Senha incorreta, verifique os dados inseridos e tente novamente");
  }
}
