import { Event } from "se-workshop-20-interfaces";

interface NotificationMessage extends Event.Notification {
    id: number
}

export { NotificationMessage };