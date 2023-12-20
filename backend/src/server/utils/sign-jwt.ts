import "dotenv/config";
import JWT from "jsonwebtoken";
import { AuthTokenInput } from "../../entities/AuthToken";
import { EntityError } from "../../entities/EntityError";

export const SignAuthorizationToken = (props: AuthTokenInput) => {
  if (typeof props.name !== "string" || props.name.length > 70) throw new EntityError("Nome inválido");

  if (typeof props.email !== "string" || props.email.length > 320) throw new EntityError("Email inválido");

  if (typeof props.userId !== "number") throw new EntityError("Usuário inválido");

  return JWT.sign({ ...props, issuedAt: new Date().getTime() }, process.env.SECRET!, { expiresIn: "6h" });
};
