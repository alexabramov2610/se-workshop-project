import {User} from "./User";
import {UserRole} from "../../api-int/Enums";

export class RegisteredUser extends User {
    protected readonly _name: string;
    protected _password: string;
    protected _role: UserRole;

    constructor(name?: string, password?: string) {
        super();
        this._name = name;
        this._password = password;
    }

    get name(): string {
        return this._name;
    }

    get role(): UserRole {
        return this._role;
    }

    set role(newROle: UserRole) {
        this._role = newROle;
    }

    get password(): string {
        return this._password;
    }
}
