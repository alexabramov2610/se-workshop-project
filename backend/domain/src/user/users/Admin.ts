import { RegisteredUser } from "../internal_api";
export class Admin extends RegisteredUser {

    constructor(name: string, password: string) {
        super(name);

    }
}