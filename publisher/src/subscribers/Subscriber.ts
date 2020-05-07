import {Event} from "se-workshop-20-interfaces";
import { Socket } from "websocket";

export interface Subscriber {
    update: (event: Event.Event, notificationId: number) => boolean;
    setSocket: (socket: Socket) => void;
    username: () => string;
}