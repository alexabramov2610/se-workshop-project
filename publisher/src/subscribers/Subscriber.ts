import {Event} from "se-workshop-20-interfaces";

export interface Subscriber {
    update: (event: Event.Event, notificationId: number) => boolean;
    setSocket: (socket: any) => void;
    username: () => string;
}