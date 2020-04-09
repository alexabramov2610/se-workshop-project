import { User } from "../internal_api";
import {UserRole} from "../../common/Enums";

export class Admin extends User{
    private readonly _role = UserRole.ADMIN;

    constructor(name: string, password: string) {
      super(name,password);
  }

    getRole(): UserRole {
        return this._role;
    }
}