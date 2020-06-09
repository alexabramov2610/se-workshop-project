import { Schema, Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import itemSchema from "./item.schema";

const purchaseSchema = new Schema({
    storeName: {type: String},
    userName: {type: String},
    item: itemSchema,
    price: {type: Number},
});

purchaseSchema.plugin(uniqueValidator);

export default purchaseSchema;
