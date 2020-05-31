import { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const eventSchema = new Schema({
    notification: {type: Number},
    amount: {type: Number},
    finalPrice: {type: Number}
});

eventSchema.plugin(uniqueValidator);

export default eventSchema;
