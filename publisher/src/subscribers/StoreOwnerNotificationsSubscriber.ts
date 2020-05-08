import { Event } from "se-workshop-20-interfaces"
import {Subscriber} from "./Subscriber";
import {NotificationMessage} from "./NotificationMessage";
import {sendMessageTo} from "websocket"

export class StoreOwnerNotificationsSubscriber implements Subscriber{

    private readonly _username: string;
    private readonly _storeName: string;


    constructor(storeOwnerName: string, storeName: string) {
        this._username = storeOwnerName;
        this._storeName = storeName;
    }

    update(event: Event.Event, notificationId: number): boolean {
        const notification: NotificationMessage = { id: notificationId, message: event.notification.message, type: event.notification.type}
        return sendMessageTo(this._username, notification);
    }

    username(): string {
        return this._username;
    }

    get storeName(): string {
        return this._storeName;
    }

    setSocket(socket: any): void {
    }

}

