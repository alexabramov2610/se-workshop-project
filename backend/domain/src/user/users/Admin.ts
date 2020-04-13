import { RegisteredUser } from "../internal_api";
import {UserRole} from "../../api-int/Enums";

export class Admin extends RegisteredUser {

    constructor(name: string, password: string) {
        super(name, password);
        this.setRole(UserRole.ADMIN);
    }
}