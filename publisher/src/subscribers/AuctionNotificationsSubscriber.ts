import {Event} from "se-workshop-20-interfaces"
import {Subscriber} from "./subscriber";
import {NotificationsColors} from "se-workshop-20-interfaces/dist/src/Enums";
import {AuctionWinnerEvent} from "se-workshop-20-interfaces/dist/src/Event";

export class AuctionNotificationsSubscriber implements Subscriber {

    private readonly _username: string;
    private readonly _storeName: string;
    private readonly _auctionId: string;
    private _sendMessageFunction: (username: string, message: Event.Notification) => boolean;


    constructor(username: string, storeName: string, auctionId: string) {
        this._username = username;
        this._storeName = storeName;
        this._auctionId = auctionId;
    }

    update(event: Event.AuctionEvent): boolean {
        let newEvent: Event.Event = event;
        if (this.instanceOfAuctionWinnerEvent(event)) {
            newEvent = this.makeCorrectEvent(<AuctionWinnerEvent> event);
        }
        return this._sendMessageFunction(this._username, newEvent.notification);
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

    setSendMessageFunction(func: (username: string, message: Event.Notification) => boolean): void {
        this._sendMessageFunction = func;
    }

    instanceOfAuctionWinnerEvent(object: any): object is AuctionWinnerEvent {
        return 'winner' in object;
    }
}

