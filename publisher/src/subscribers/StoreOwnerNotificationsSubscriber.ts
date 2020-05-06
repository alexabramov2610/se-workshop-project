import { Event } from "se-workshop-20-interfaces"

export class StoreOwnerNotificationsSubscriber {

    private readonly _storeOwnerName: string;
    private readonly _storeName: string;
    private _sendMessageFunction: (username: string, message: string) => boolean;


    constructor(storeOwnerName: string, storeName: string) {
        this._storeOwnerName = storeOwnerName;
        this._storeName = storeName;
    }

    updateNewPurchase(event: Event.NewPurchaseEvent): boolean {
        return this._sendMessageFunction(this.storeOwnerName, event.message);
    }

    get storeOwnerName(): string {
        return this._storeOwnerName;
    }

    get storeName(): string {
        return this._storeName;
    }

    setSendMessageFunction(func: (username: string, message: string) => boolean) {
        this._sendMessageFunction = func;
    }
}

