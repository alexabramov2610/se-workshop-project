import {Schema} from "mongoose";

const notificationSchema = new Schema({
    message: {type: String, required: true},
    type: {type: Number, required: true}
});

export default notificationSchema;
