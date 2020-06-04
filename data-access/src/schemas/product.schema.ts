import {Schema, Types} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import itemSchema from "./item.schema";

const productSchema = new Schema({
    items: {type: [itemSchema], default: []},
    catalogNumber: {type: Number, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    category: {
        type: String,
        enum: ["GENERAL", "ELECTRONICS", "HOBBIES", "HOME", "CLOTHING"],
    },
    rating: {type: Number, enum: [1, 2, 3, 4, 5]},
}, {autoCreate: true});

productSchema.plugin(uniqueValidator);
export default productSchema;

