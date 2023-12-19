import "dotenv/config";

import { hashSync } from "bcrypt";

export interface IUser {
  userId: number;
  name: string;
  email: string;
  password: string;
  profileImage: string | null;

  createdAt: Date;
  deletedAt: Date | null;
}

export class User implements IUser {
  readonly userId: number;
  email: string;
  name: string;
  password: string;
  profileImage: string | null;

  readonly createdAt: Date;
  deletedAt: Date | null;

  constructor(props: IUser) {
    this.userId = props.userId;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.profileImage = props.profileImage;
    this.createdAt = props.createdAt;
    this.deletedAt = props.deletedAt;
  }

  public deactivateAccount() {
    this.deletedAt = new Date();
  }

  public reactivateAccount() {
    this.deletedAt = null;
  }

  public updatePicture(fileName: string) {}

  public updateEmail(email: string) {
    this.email = email;
  }

  public updateName(name: string) {
    this.name = name;
  }

  public updatePassword(password: string) {
    this.password = hashSync(password, Number(process.env.SALT));
  }
}
