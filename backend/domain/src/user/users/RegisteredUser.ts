import {User} from "./User";

export class RegisteredUser extends User {
    protected readonly _name: string;
    protected _password: string;
    protected _role;

    constructor(name?: string, password?: string) {
        super();
        this._name = name;
        this._password = password;
    }

    get name(): string {
        return this._name;
    }

    get password(): string {
        return this._password;
    }
}
