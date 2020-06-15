import { Event } from "se-workshop-20-interfaces"
import {Subscriber} from "./Subscriber";
import {NotificationMessage, StatisticsNotificationMessage} from "./NotificationMessage";
import {sendMessageTo} from "websocket"

export class StatisticsEventsSubscriber implements Subscriber {

    private readonly _username: string;


    constructor(storeOwnerName: string) {
        this._username = storeOwnerName;
    }

    update(event: Event.StatisticsUpdateEvent, notificationId: number) : boolean {
        const notification: StatisticsNotificationMessage = { id: notificationId, message: event.notification.message, type: event.notification.type, statistics: event.statistics}
        return sendMessageTo(this._username, notification);
    }

    username(): string {
        return this._username;
    }

    setSocket(socket: any): void {
    }
}

