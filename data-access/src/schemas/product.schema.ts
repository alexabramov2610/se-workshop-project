import {Schema} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import itemSchema from "./item.schema";
import {ProductCategory, Rating} from "se-workshop-20-interfaces/dist/src/Enums";

const productSchema = new Schema({
    items: {type: [itemSchema], default: []},
    catalogNumber: {type: Number, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    storeName: {type: String, required: true},
    category: {
        type: String,
        enum: Object.values(ProductCategory),
    },
    rating: {type: Number, enum: Object.values(Rating)},
}, {autoCreate: true});

productSchema.plugin(uniqueValidator);
export default productSchema;

