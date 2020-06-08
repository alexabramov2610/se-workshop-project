import {Schema, Types} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import notificationSchema from "./notification.schema";

const eventSchema = new Schema({
    notification: {type: notificationSchema, required: true}, //{type: Types.ObjectId, ref: 'notifications'},
    code: {type: Number, required: true},
    username: {type: String, required: true}
});

export default eventSchema;
