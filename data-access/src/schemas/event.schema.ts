import { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const eventSchema = new Schema({
    notification: {type: Number},
    amount: {type: Number},
    finalPrice: {type: Number}
},{autoCreate: true});

eventSchema.plugin(uniqueValidator);

export default eventSchema;
