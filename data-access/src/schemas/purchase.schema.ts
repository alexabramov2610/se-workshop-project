import { Schema, Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const purchaseSchema = new Schema({
    storeName: {type: String},
    userName: {type: String},
    item: {type: Types.ObjectId, ref: 'Item'},
    price: {type: Number},
});

purchaseSchema.plugin(uniqueValidator);

export default purchaseSchema;
