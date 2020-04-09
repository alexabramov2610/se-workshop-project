import { UserRole } from "../common/internal_api"

export abstract class User {
  private readonly _UUID: string;
  protected readonly _name: string;
  protected _password: string;

  protected constructor(name: string, password: string) {
    this._name = name;
    this._password = password;
    this._UUID = Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  get name(): string {
    return this._name;
  }


  get UUID(): string {
    return this._UUID;
  }

  abstract getRole(): UserRole;
}
