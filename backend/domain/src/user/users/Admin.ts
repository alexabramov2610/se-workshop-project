import { RegisteredUser } from "../internal_api";
import {UserRole} from "../../api-int/Enums";

export class Admin extends RegisteredUser {

    constructor(name: string, password: string,uuid?: string) {
        super(name, password,uuid);
        this.setRole(UserRole.ADMIN);
    }
}