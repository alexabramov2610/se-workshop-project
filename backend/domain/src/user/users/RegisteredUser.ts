import {User} from "./User";
import {UserRole} from "../../api-int/Enums";
import {Receipt} from "../../trading_system/data/Receipt";

export class RegisteredUser extends User {
    protected readonly _name: string;
    protected _password: string;
    protected _role: UserRole;
    private _receipts: Receipt[];

    constructor(name?: string, password?: string) {
        super();
        this._name = name;
        this._password = password;
        this._receipts = [];
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

    get receipts(): Receipt[] {
        return this._receipts;
    }
}
