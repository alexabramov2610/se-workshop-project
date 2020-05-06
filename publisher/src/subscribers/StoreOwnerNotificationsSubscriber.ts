import { Event } from "se-workshop-20-interfaces"
import {Subscriber} from "./subscriber";

export class StoreOwnerNotificationsSubscriber implements Subscriber{

    private readonly _username: string;
    private readonly _storeName: string;
    private _sendMessageFunction: (username: string, message: Event.Notification) => boolean;


    constructor(storeOwnerName: string, storeName: string) {
        this._username = storeOwnerName;
        this._storeName = storeName;
    }

    update(event: Event.Event): boolean {
        return this._sendMessageFunction(this._username, event.notification);
    }

    username(): string {
        return this._username;
    }

    get storeName(): string {
        return this._storeName;
    }

    setSendMessageFunction(func: (username: string, message: Event.Notification) => boolean): void {
        this._sendMessageFunction = func;
    }

}

