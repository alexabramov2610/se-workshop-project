import {Schema} from "mongoose";
import {ProductCategory} from "se-workshop-20-interfaces/dist/src/Enums";
import conditionSchema from "./condition.schema";

const discountSchema = new Schema({
        operator: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
        },
        duration: {
            type: Number,
            required: true
        },
        percentage: {
            type: Number,
            required: true
        },
        productsInDiscount: {
            type: [Number],
            default: []
        },
        category: {
            type: String,
            enum: Object.values(ProductCategory),
        },
        conditions: {
            type: [conditionSchema],
        },
        storeName: {type: String}
    },
    {timestamps: false,})

export default discountSchema;
