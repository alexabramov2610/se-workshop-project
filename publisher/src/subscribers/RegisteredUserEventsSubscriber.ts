import { Event } from "se-workshop-20-interfaces"
import {Subscriber} from "./Subscriber";
import { Socket } from "websocket";
import {NotificationMessage} from "./NotificationMessage";

export class RegisteredUserEventsSubscriber implements Subscriber {

    private readonly _username: string;
    private _socket: Socket;


    constructor(storeOwnerName: string) {
        this._username = storeOwnerName;
    }

    update(event: Event.Event, notificationId: number) : boolean {
        const notification: NotificationMessage = { id: notificationId, message: event.notification.message, notificationColor: event.notification.notificationColor}
        return this._socket.sendMessageTo(this._username, notification);
    }

    username(): string {
        return this._username;
    }

    setSocket(socket: Socket): void {
        this._socket = socket;
    }
}

