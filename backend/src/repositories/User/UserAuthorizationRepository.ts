import { IUserQueryRepository, UserQueryRepository } from "./UserQueryRepository";

export interface IUserAuthorizationRepository {
  userQueryRepository: IUserQueryRepository;
  isUserActive(userId: number): Promise<boolean>;
}

export class UserAuthenticationRepository implements IUserAuthorizationRepository {
  userQueryRepository: IUserQueryRepository;

  constructor() {
    this.userQueryRepository = new UserQueryRepository();
  }

  async isUserActive(userId: number): Promise<boolean> {
    const { deletedAt } = await this.userQueryRepository.findById(userId);

    if (deletedAt) return false;
    return true;
  }
}
