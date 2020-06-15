import { Event } from "se-workshop-20-interfaces";
import {VisitorsStatistics} from "se-workshop-20-interfaces/dist/src/CommonInterface";

interface NotificationMessage extends Event.Notification {
    id: number
}

interface StatisticsNotificationMessage extends NotificationMessage {
    statistics :VisitorsStatistics
}

export { NotificationMessage, StatisticsNotificationMessage };