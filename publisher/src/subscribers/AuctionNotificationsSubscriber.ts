import {Event} from "se-workshop-20-interfaces"
import {Subscriber} from "./Subscriber";
import {NotificationsColors} from "se-workshop-20-interfaces/dist/src/Enums";
import {AuctionWinnerEvent} from "se-workshop-20-interfaces/dist/src/Event";
import { Socket } from "websocket";
import {NotificationMessage} from "./NotificationMessage";

export class AuctionNotificationsSubscriber implements Subscriber {

    private readonly _username: string;
    private readonly _storeName: string;
    private readonly _auctionId: string;
    private _socket: Socket;
    private id: number;

    constructor(username: string, storeName: string, auctionId: string) {
        this._username = username;
        this._storeName = storeName;
        this._auctionId = auctionId;
        this.id = 0;
    }

    update(event: Event.AuctionEvent): boolean {
        let newEvent: Event.Event = event;
        if (this.instanceOfAuctionWinnerEvent(event)) {
            newEvent = this.makeCorrectEvent(<AuctionWinnerEvent> event);
        }
        this.id ++;
        const notification: NotificationMessage = { id: this.id, message: event.notification.message, notificationColor: event.notification.notificationColor}
        return this._socket.sendMessageTo(this._username, notification);
    }

    makeCorrectEvent(event: AuctionWinnerEvent): AuctionWinnerEvent {       //todo: remove this
        const isWinner: boolean = event.winner === this._username;
        return { code: event.code, auctionId: event.auctionId, winner: event.winner, username: event.username,
                notification: { notificationColor: isWinner ? NotificationsColors.BLUE : NotificationsColors.RED,
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

    setSocket(socket: Socket): void {
        this._socket = socket;
    }

    instanceOfAuctionWinnerEvent(object: any): object is AuctionWinnerEvent {
        return 'winner' in object;
    }
}

