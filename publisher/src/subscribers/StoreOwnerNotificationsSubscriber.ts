import { Event } from "se-workshop-20-interfaces"
import { socket } from "communication";

export class StoreOwnerNotificationsSubscriber {

    private readonly _storeOwnerName: string;
    private readonly _storeName: string;


    constructor(storeOwnerName: string, storeName: string) {
        this._storeOwnerName = storeOwnerName;
        this._storeName = storeName;
    }

    updateNewPurchase(event: Event.NewPurchaseEvent): boolean {
        // return socket.sendMessageTo(this._storeName, event.message)
        return true;
    }

    get storeOwnerName(): string {
        return this._storeOwnerName;
    }

    get storeName(): string {
        return this._storeName;
    }
}

