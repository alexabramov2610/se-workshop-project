import {Schema} from "mongoose";
import {ProductCategory} from "se-workshop-20-interfaces/dist/src/Enums";

const discountSchema = new Schema({
        operator: {
            type: String,
            required: true
        },
        date: {
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
        children: {
            type: Map,
            of: [String],
            default: new Map()
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
            type: Map,
            of: [String],
            default: new Map()
        },
    },
    {timestamps: false,})

export default discountSchema;
