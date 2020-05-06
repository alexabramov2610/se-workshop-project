import { Event } from "se-workshop-20-interfaces"
import {Subscriber} from "./subscriber";

export class RegisteredUserEventsSubscriber implements Subscriber {

    private readonly _username: string;
    private _sendMessageFunction: (username: string, message: Event.Notification) => boolean;


    constructor(storeOwnerName: string) {
        this._username = storeOwnerName;
    }

    update(event: Event.Event) : boolean {
        return this._sendMessageFunction(this._username, event.notification);
    }

    username(): string {
        return this._username;
    }

    setSendMessageFunction(func: (username: string, message: Event.Notification) => boolean): void {
        this._sendMessageFunction = func;
    }
}

