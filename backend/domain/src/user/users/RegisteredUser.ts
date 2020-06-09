import {User} from "./User";
import {Event} from "se-workshop-20-interfaces/dist/src/Event";
import {IReceipt} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {UserRole} from "../../api-int/Enums";

export interface RegisteredUser extends User {
    name: string;
    password: string;
    pendingEvents: Event[];
    receipts: IReceipt[];
}