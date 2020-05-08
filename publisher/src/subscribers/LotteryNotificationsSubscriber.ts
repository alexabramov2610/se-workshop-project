import { Event } from "se-workshop-20-interfaces"
import {Subscriber} from "./Subscriber";
import {NotificationMessage} from "./NotificationMessage";
import {sendMessageTo} from "websocket"

export class LotteryNotificationsSubscriber implements Subscriber {

    private readonly _username: string;
    private readonly _storeName: string;
    private readonly _lottery_id: string;
    // private _socket: any;


    constructor(storeOwnerName: string, storeName: string, lottery_id: string) {
        this._username = storeOwnerName;
        this._storeName = storeName;
        this._lottery_id = lottery_id;
    }

    update(event: Event.Event, notificationId: number) : boolean {
        const notification: NotificationMessage = { id: notificationId, message: event.notification.message, type: event.notification.type}
        return sendMessageTo(this._username, notification);
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

    setSocket(socket: any): void {
        // this._socket = socket;
    }
}

