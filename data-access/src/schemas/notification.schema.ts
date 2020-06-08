import {Schema} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const notificationSchema = new Schema({
    message: {type: String, required: true},
    type: {type: Number, required: true}
});

export default notificationSchema;
