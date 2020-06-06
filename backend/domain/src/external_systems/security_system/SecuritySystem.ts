import bcrypt from 'bcrypt'
import {BoolResponse} from "se-workshop-20-interfaces/dist/src/Response";

export class SecuritySystem {
    private _securitySys: any;
    private _name: string;

    constructor() {
        this._name = "Security System"
        this._securitySys = bcrypt;
    }

    async encryptPassword(password: string) {
        const hash = await bcrypt.hash(password,1);
        return hash;
    }

    comparePassword(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }

    connect(): BoolResponse {
        const succ: BoolResponse = {data: {result: true}};
        return succ;
    }
}

