import { Event } from "se-workshop-20-interfaces"
import {Subscriber} from "./subscriber";

export class LotteryNotificationsSubscriber implements Subscriber {

    private readonly _username: string;
    private readonly _storeName: string;
    private readonly _lottery_id: string;
    private _sendMessageFunction: (username: string, message: string) => boolean;


    constructor(storeOwnerName: string, storeName: string, lottery_id: string) {
        this._username = storeOwnerName;
        this._storeName = storeName;
        this._lottery_id = lottery_id;
    }

    update(event: Event.NewPurchaseEvent): boolean {
        return this._sendMessageFunction(this._username, event.message);
    }

    username(): string {
        return this._username;
    }

    get storeName(): string {
        return this._storeName;
    }

    get lottery_id(): string {
        return this._lottery_id;
    }

    setSendMessageFunction(func: (username: string, message: string) => boolean) {
        this._sendMessageFunction = func;
    }
}

