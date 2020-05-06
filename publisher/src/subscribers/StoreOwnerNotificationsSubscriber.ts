import { Event } from "se-workshop-20-interfaces"
import {Subscriber} from "./Subscriber";
import { Socket } from "websocket";
import {NotificationMessage} from "./NotificationMessage";

export class StoreOwnerNotificationsSubscriber implements Subscriber{

    private readonly _username: string;
    private readonly _storeName: string;
    private _socket: Socket;
    private id: number;


    constructor(storeOwnerName: string, storeName: string) {
        this._username = storeOwnerName;
        this._storeName = storeName;
        this.id = 0;
    }

    update(event: Event.Event): boolean {
        this.id ++;
        const notification: NotificationMessage = { id: this.id, message: event.notification.message, notificationColor: event.notification.notificationColor}
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

