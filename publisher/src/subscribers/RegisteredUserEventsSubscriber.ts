import { Event } from "se-workshop-20-interfaces"
import {Subscriber} from "./Subscriber";
import {NotificationMessage} from "./NotificationMessage";
import {sendMessageTo} from "websocket"

export class RegisteredUserEventsSubscriber implements Subscriber {

    private readonly _username: string;


    constructor(storeOwnerName: string) {
        this._username = storeOwnerName;
    }

    update(event: Event.Event, notificationId: number) : boolean {
        const notification: NotificationMessage = { id: notificationId, message: event.notification.message, type: event.notification.type}
        return sendMessageTo(this._username, notification);
    }

    username(): string {
        return this._username;
    }

    setSocket(socket: any): void {
    }
}

