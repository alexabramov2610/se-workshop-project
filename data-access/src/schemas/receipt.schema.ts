import {Schema, Types} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const receiptSchema = new Schema({
    // purchases: [{type: Types.ObjectId, ref: 'Purchase'}],
    date: {type: Date},
    lastCC4: {type: String},
    totalCharged: {type: Number}
});

receiptSchema.plugin(uniqueValidator);

export default receiptSchema;
