import {User} from "./User";
import {UserRole} from "../../api-int/Enums";
import {Event} from "se-workshop-20-interfaces/dist/src/Event";
import {BagItem, IReceipt} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export class RegisteredUser extends User {
    protected readonly _name: string;
    protected _password: string;
    protected _role: UserRole;
    private readonly _pendingEvents: Event[];
    private readonly _receipts: IReceipt[];

    constructor(name?: string, password?: string, pendingEvents?: Event[], receipts?: IReceipt[], cart?: Map<string, BagItem[]>, role?: UserRole) {
        super(cart);
        this._name = name;
        this._password = password;
        this._pendingEvents = pendingEvents ? pendingEvents : [];
        this._receipts = receipts ? receipts : [];
        this._role = role ? role : UserRole.BUYER
    }


    addReceipt(receipt: IReceipt) {
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

    get receipts(): IReceipt[] {
        return this._receipts;
    }

    saveNotification(event: Event) {
        this._pendingEvents.push(event);
    }


    get pendingEvents(): Event[] {
        return this._pendingEvents;
    }

}
