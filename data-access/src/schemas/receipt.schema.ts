import {Schema, Types} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import purchaseSchema from "./purchase.schema";

const receiptSchema = new Schema({
    purchases: [purchaseSchema],
    date: {type: Date},
    lastCC4: {type: String},
    totalCharged: {type: Number},
    transactionID: {type: Number}
}, {autoCreate: true});

receiptSchema.plugin(uniqueValidator);

export default receiptSchema;
