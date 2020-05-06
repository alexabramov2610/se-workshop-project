import {Event} from "se-workshop-20-interfaces";

export interface Subscriber {
    update: (event: Event.Event) => boolean;
    setSendMessageFunction: (func: (username: string, message: Event.Notification) => boolean) => void;
    username: () => string;
}