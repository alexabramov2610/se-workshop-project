import { User } from "./internal_api"
import { UserRole } from "../common/internal_api"

export class StoreOwner extends User {
    private readonly _role = UserRole.OWNER;

    constructor(name: string, password: string) {
        super(name, password);
    }

    get id(): string {
        return this._name;
    }

    getRole(): UserRole {
        return this._role;
    }

}