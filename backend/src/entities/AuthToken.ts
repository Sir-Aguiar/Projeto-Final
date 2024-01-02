import "dotenv/config";

export interface IAuthTokenPayload {
  userId: number;
  email: string;
  name: string;
  issuedAt: number;
  expiresAt: number;
}

export type AuthTokenInput = Omit<IAuthTokenPayload, "issuedAt" | "expiresAt">;

export class AuthorizationToken {
  static payload() {}
  static isValid() {}
}
