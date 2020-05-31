import {User} from "./User";
import {UserRole} from "../../api-int/Enums";
import {Receipt} from "../../trading_system/data/Receipt";
import {Event} from "se-workshop-20-interfaces/dist/src/Event";

export class RegisteredUser extends User {
    protected readonly _name: string;
    protected _password: string;
    protected _role: UserRole;
    private _pendingEvents: Event[];
    private _receipts: Receipt[];
    constructor(name?: string, password?: string,pendingEvents?:Event[], receipts?: Receipt[]) {
        super();
        this._name = name;
        this._password = password;
        this._pendingEvents = pendingEvents? pendingEvents : [];
        this._receipts = receipts? receipts : [];
    }


    addReceipt(receipt: Receipt) {
        this._receipts.push(receipt);
    }

    get name(): string {
        return this._name;
    }

    get role(): UserRole {
        return this._role;
    }

    set role(newRole: UserRole) {
        this._role = newRole;
    }

    get password(): string {
        return this._password;
    }

    get receipts(): Receipt[] {
        return this._receipts;
    }

    saveNotification(event: Event) {
        this._pendingEvents.push(event);
    }


    get pendingEvents(): Event[] {
        return this._pendingEvents;
    }

}
