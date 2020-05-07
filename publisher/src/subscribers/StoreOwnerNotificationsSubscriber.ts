import { Event } from "se-workshop-20-interfaces"
import {Subscriber} from "./Subscriber";
import { Socket } from "websocket";
import {NotificationMessage} from "./NotificationMessage";

export class StoreOwnerNotificationsSubscriber implements Subscriber{

    private readonly _username: string;
    private readonly _storeName: string;
    private _socket: Socket;


    constructor(storeOwnerName: string, storeName: string) {
        this._username = storeOwnerName;
        this._storeName = storeName;
    }

    update(event: Event.Event, notificationId: number): boolean {
        const notification: NotificationMessage = { id: notificationId, message: event.notification.message, notificationColor: event.notification.notificationColor}
        return this._socket.sendMessageTo(this._username, notification);
    }

    username(): string {
        return this._username;
    }

    get storeName(): string {
        return this._storeName;
    }

    setSocket(socket: Socket): void {
        this._socket = socket;
    }

}

