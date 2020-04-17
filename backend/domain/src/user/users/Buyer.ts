import { RegisteredUser } from "../internal_api"
import { UserRole } from "../../api-int/internal_api"

export class Buyer extends RegisteredUser {
    constructor(name: string, password: string) {
        super(name);
    }
}


// constructor(name: string, password: string, uuid?: string) {
//     super(name, password, uuid);
//     this.setRole(UserRole.BUYER);
//     }