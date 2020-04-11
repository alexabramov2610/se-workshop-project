import { UserRole } from "../../common/internal_api"
import { v4 as uuid } from 'uuid';

export abstract class RegisteredUser {
  protected readonly _UUID: string;
  protected readonly _name: string;
  protected _password: string;
  protected _role;

  protected constructor(name: string, password: string) {
    this._name = name;
    this._password = password;
    this._UUID = uuid();
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this._password;
  }

  get UUID(): string {
    return this._UUID;
  }

  getRole(): UserRole {
   return this._role;
  }

  setRole(role: UserRole): void {
    this._role = role;
  }
}
