import { RegisteredUser } from "../internal_api"
import { UserRole } from "../../common/internal_api"

export class Buyer extends RegisteredUser {
    constructor(name: string, password: string) {
        super(name, password);
        this.setRole(UserRole.BUYER);
    }
}