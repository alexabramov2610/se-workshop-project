import { Event } from "se-workshop-20-interfaces"
import {Subscriber} from "./Subscriber";
import { Socket } from "websocket";
import {NotificationMessage} from "./NotificationMessage";

export class RegisteredUserEventsSubscriber implements Subscriber {

    private readonly _username: string;
    private _socket: Socket;
    private id: number;


    constructor(storeOwnerName: string) {
        this._username = storeOwnerName;
        this.id = 0;
    }

    update(event: Event.Event) : boolean {
        this.id ++;
        const notification: NotificationMessage = { id: this.id, message: event.notification.message, notificationColor: event.notification.notificationColor}
        return this._socket.sendMessageTo(this._username, notification);
    }

    username(): string {
        return this._username;
    }

    setSocket(socket: Socket): void {
        this._socket = socket;
    }
}

