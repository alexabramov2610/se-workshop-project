import {Event} from "se-workshop-20-interfaces"
import {Subscriber} from "./Subscriber";
import {NotificationsType} from "se-workshop-20-interfaces/dist/src/Enums";
import {AuctionWinnerEvent} from "se-workshop-20-interfaces/dist/src/Event";
import {NotificationMessage} from "./NotificationMessage";
import {sendMessageTo} from "websocket"

export class AuctionNotificationsSubscriber implements Subscriber {

    private readonly _username: string;
    private readonly _storeName: string;
    private readonly _auctionId: string;
    // private _socket: any;

    constructor(username: string, storeName: string, auctionId: string) {
        this._username = username;
        this._storeName = storeName;
        this._auctionId = auctionId;
    }

    update(event: Event.AuctionEvent, notificationId: number): boolean {
        let newEvent: Event.Event = event;
        if (this.instanceOfAuctionWinnerEvent(event)) {
            newEvent = this.makeCorrectEvent(<AuctionWinnerEvent> event);
        }
        const notification: NotificationMessage = { id: notificationId, message: newEvent.notification.message, type: newEvent.notification.type}
        return sendMessageTo(this._username, notification);
    }

    makeCorrectEvent(event: AuctionWinnerEvent): AuctionWinnerEvent {       //todo: remove this
        const isWinner: boolean = event.winner === this._username;
        return { code: event.code, auctionId: event.auctionId, winner: event.winner, username: event.username,
                notification: { type: isWinner ? NotificationsType.BLUE : NotificationsType.RED,
                message: event.notification.message + isWinner ? "won!" : "lost!"
            }
        }
    }

    username(): string {
        return this._username;
    }

    get storeName(): string {
        return this._storeName;
    }

    get auctionId(): string {
        return this._auctionId;
    }

    setSocket(socket: any): void {
        // this._socket = socket;
    }

    instanceOfAuctionWinnerEvent(object: any): object is AuctionWinnerEvent {
        return 'winner' in object;
    }
}

