import {Event} from "se-workshop-20-interfaces";

export interface Subscriber {
    update: (event: Event.Event) => boolean;
    username: () => string;
}