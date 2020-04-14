import { RegisteredUser } from "../internal_api"
import { UserRole } from "../../api-int/internal_api"

export class StoreOwner extends RegisteredUser {
    constructor(name: string, password: string, uuid?: string) {
        super(name, password, uuid);
        this.setRole(UserRole.OWNER);
    }
}