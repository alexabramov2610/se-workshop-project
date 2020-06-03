import { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const bagItemSchema = new Schema({
    product: {type: Number},
    amount: {type: Number},
    finalPrice: {type: Number}
});

bagItemSchema.plugin(uniqueValidator);

export default bagItemSchema;
