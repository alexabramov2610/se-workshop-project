import { User } from "../internal_api"
import { UserRole } from "../../common/internal_api"

export class Buyer extends User {
    private readonly _role = UserRole.BUYER;

    constructor(name: string, password: string) {
        super(name, password);
    }


    getRole(): UserRole {
        return this._role;
    }

}