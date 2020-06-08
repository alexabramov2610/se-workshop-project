import {Schema, Types} from "mongoose";
import notificationSchema from "./notification.schema";

const eventSchema = new Schema({
    notification: {type: notificationSchema, required: true},
    code: {type: Number, required: true},
    username: {type: String, required: true}
});

export default eventSchema;
